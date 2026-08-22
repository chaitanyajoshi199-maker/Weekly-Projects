import os
import cv2 as cv
from cv2 import imread, imshow, waitKey, destroyAllWindows
import numpy as np
import random

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REFERENCE_IMAGE_PATH = os.path.join(os.path.dirname(SCRIPT_DIR), 'test images', 'bottle.png')

def resize_to_height(img, target_height=600):
    """Resizes image to a consistent height to handle oversized inputs properly."""
    h, w = img.shape[:2]
    scale = target_height / h
    return cv.resize(img, (int(w * scale), target_height))

def detect_defects(reference_src, test_src, defect_type, diff_thresh=25, min_area=10):
    ref_img = imread(reference_src)
    test_img = imread(test_src)

    if ref_img is None:
        print(f"Failed to load reference: {reference_src}")
        return None
    if test_img is None:
        print(f"Failed to load test image: {test_src}")
        return None

    # Standardize both images to a proper uniform size (600px height)
    ref_img = resize_to_height(ref_img, target_height=600)
    test_img = resize_to_height(test_img, target_height=600)

    ref_g = cv.cvtColor(ref_img, cv.COLOR_BGR2GRAY)
    test_g = cv.cvtColor(test_img, cv.COLOR_BGR2GRAY)

    # Step 1: Detect SIFT features to align images precisely regardless of scale/crop
    sift = cv.SIFT_create(nfeatures=2000)
    kp1, des1 = sift.detectAndCompute(ref_g, None)
    kp2, des2 = sift.detectAndCompute(test_g, None)

    flann = cv.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=50))
    matches = flann.knnMatch(des1, des2, k=2)

    good_matches = []
    for m_n in matches:
        if len(m_n) == 2:
            m, n = m_n
            # Lowe's ratio test
            if m.distance < 0.75 * n.distance:
                good_matches.append(m)

    if len(good_matches) < 10:
        print(f"[{os.path.basename(test_src)}] -> FAILED ALIGNMENT (Not enough matches)")
        return test_img

    src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

    # Step 2: Compute Homography and warp reference image to perfectly match test image perspective
    M, mask = cv.findHomography(src_pts, dst_pts, cv.RANSAC, 5.0)
    if M is None:
        return test_img

    h, w = test_g.shape
    ref_aligned = cv.warpPerspective(ref_g, M, (w, h))

    # Step 3: Blur to ignore minor lighting differences, then compute absolute difference
    ref_blur = cv.GaussianBlur(ref_aligned, (5, 5), 0)
    test_blur = cv.GaussianBlur(test_g, (5, 5), 0)
    diff = cv.absdiff(ref_blur, test_blur)

    # Step 4: Mask out the border of the warped image to avoid false edges
    warp_mask = cv.warpPerspective(np.ones_like(ref_g) * 255, M, (w, h))
    warp_mask = cv.erode(warp_mask, np.ones((25, 25), np.uint8))
    diff[warp_mask == 0] = 0

    # Step 5: Threshold and morphological cleanup to group defects
    _, thresh = cv.threshold(diff, diff_thresh, 255, cv.THRESH_BINARY)
    clean = cv.morphologyEx(thresh, cv.MORPH_OPEN, np.ones((3, 3), np.uint8))
    clustered = cv.morphologyEx(clean, cv.MORPH_CLOSE, np.ones((15, 15), np.uint8))

    # Step 6: Find contours of grouped defects
    contours, _ = cv.findContours(clustered, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

    output_image = test_img.copy()
    defect_count = 0
    img_area = w * h

    biggest_defect_area = 0
    defect_details = None

    for c in contours:
        area = cv.contourArea(c)
        # Filter out tiny noise and massive boundary boxes
        if min_area < area < (img_area * 0.5):
            defect_count += 1
            x, y, w_box, h_box = cv.boundingRect(c)
            if area > biggest_defect_area:
                biggest_defect_area = area
                defect_details = {
                    "type": defect_type,
                    "location": {
                        "x": x,
                        "y": y
                    },
                    "size": {
                        "width": w_box, 
                        "height": h_box
                    },
                    "severity": 'Critical' if defect_type in ['Hole', 'Crack'] else 'High' if defect_type in ['Dent', 'Blist'] else 'Medium' if defect_type in ['Scratch', 'Scratches'] else 'Low',
                    "threshold": diff_thresh
                } 
                
            # Draw tight bounding box specifically around the error
            cv.rectangle(output_image, (x, y), (x + w_box, y + h_box), (0, 0, 255), 2)
            cv.putText(output_image, f'Defect #{defect_count}', (x, max(15, y - 8)),cv.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)

    # Step 7: Output Pass/Fail
    if defect_count == 0:
        defect_details=None
        cv.putText(output_image, 'PASSED: No Defects', (15, 35),
                   cv.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
        print(f"[{os.path.basename(test_src)}] -> PASSED (Clean)")
    else:
        cv.putText(output_image, f'FAILED: {defect_count} Defect(s)', (15, 35),
                   cv.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 255), 2)
        print(f"[{os.path.basename(test_src)}] -> FAILED ({defect_count} defect(s) detected)")

    # Save with a single constant filename to overwrite each time
    filename = "processed_image.jpg"
    
    import base64
    
    # Encode the image into memory as a JPEG
    _, buffer = cv.imencode('.jpg', output_image)
    
    # Convert to base64 string
    base64_img = base64.b64encode(buffer).decode('utf-8')
    
    # Format as a Data URL for the frontend
    image_data_url = f"data:image/jpeg;base64,{base64_img}"

    return {
        # Using base64 Data URL bypasses the file system entirely! Lightning fast.
        "imageUrl": image_data_url,
        "defectDetails": defect_details,
        "status": "FAIL" if defect_count > 0 else "PASS"
    }
