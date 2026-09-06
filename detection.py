import cv2 as cv
import matplotlib.pyplot as plt
import numpy as np
from cv2 import imread,imshow
from math import pi
import time

def detect_defect(src):

    start_time=time.perf_counter()

    # 1.loading image 
    img=imread(src)

    if img is None:
        print('Unable to load image')
        return

    # 2.converting to grayscale and thesholding to get the contours
    gray=cv.cvtColor(img,cv.COLOR_BGR2GRAY)
    blur=cv.GaussianBlur(gray,(5,5),5) 

    threshold=cv.threshold(gray,0,255,cv.THRESH_BINARY_INV|cv.THRESH_OTSU)[1]
    cleaning=cv.morphologyEx(threshold,cv.MORPH_CLOSE,np.ones((5,5),dtype=np.uint8),iterations=5)

    kernel=cv.getStructuringElement(cv.MORPH_ELLIPSE,(3,3))
    cleaned=cv.dilate(cleaning,kernel,iterations=3)
    canny=cv.Canny(cleaned,100,250)
    plt.imshow(canny,cmap='gray')
    plt.show()
 
    contour=cv.findContours(canny,cv.RETR_LIST,cv.CHAIN_APPROX_SIMPLE)[0]
    print(len(contour))
 
    max_c=max(contour,key=cv.contourArea)

    mask=np.ones((gray.shape),dtype=np.uint8)
    cv.drawContours(mask,[max_c],-1,255,thickness=cv.FILLED)

    # shave_k=np.ones((25,25),np.uint8)
    # bottle_mask=cv.erode(mask,shave_k,iterations=1)
    # plt.imshow(bottle_mask,cmap='gray')
    # plt.show()

    rect_max=cv.minAreaRect(max_c)
    (width,height),angle=rect_max[1:]
    real_mm=220
    ratio=real_mm/width

    if angle<=-45:
        angle=90+angle
    else:
        angle=-angle

    is_misalligned=abs(angle)>3
    
    # center=(rect_max[0,0],rect_max[0,1])
    # get_kernel=cv.getRotationMatrix2D(center,angle,1)

    # get_kernel=cv.getRotationMatrix2D()
    defect_image=img.copy() 

    defect_details=[] 
    for c in contour:
        if cv.contourArea(c)<15:
            continue

        if np.array_equal(c,max_c):
            continue
        
        rect=cv.minAreaRect(c)
        (w,h)=rect[1]

        # getting the mm/px ratio and calcualting defect in mm 

        width_mm=w*ratio
        height_mm=h*ratio

        area_mm=(width_mm*height_mm)

        if h==0 or w==0:
            continue

        aspect_r=max(w,h)/min(w,h)
        area=cv.contourArea(c)
        perim=cv.arcLength(c,True)
        
        if perim==0:
            continue
        
        circularity=(4*pi*area)/perim**2
        
        if aspect_r>3 and circularity<0.4:
            defect_type='Scratch'
        
        elif 0.8<=aspect_r<=1.05 and circularity>=0.8:
            defect_type='Dent'
        
        else:
            defect_type='Unknown'

        if defect_type!='Unknown':
            box=cv.boxPoints(rect)
            box=np.int32(box)
            cv.drawContours(defect_image,[box],-1,(0,0,255),2)
            
            defect_details.append({
                    'defect_type':defect_type,
                    'size':{
                        'width_mm':width_mm,
                        'height_mm':height_mm,
                        'area_mm':area_mm
                    },
                    'aspect_ratio':aspect_r,
                    'circularity':circularity
                })
    
    total_defect_area=sum(d['size']['area_mm'] for d in defect_details)
    num_of_defect=len(defect_details)

    # the num of the confidence will redce as we get various defects, count and misaligned 
    area_penalty=total_defect_area*0.5
    count_penalty=num_of_defect*15
    misallignment_penalty=15 if is_misalligned else 0

    confidence=max(0,min(100,100-(area_penalty+count_penalty+misallignment_penalty)))
    confidence=round(confidence,2)
    plt.imshow(defect_image)
    plt.show()
    cv.imwrite(f'../media/images/defects/defect_{round(time.time(),5)}.png',defect_image)

    processing_time=round((time.perf_counter()-start_time)*1000,5)
    return {
        'defect_details':defect_details,
        'defect_details_count':len(defect_details),
        'processing_time_ms:':processing_time,
        'misalligned':is_misalligned,
        'confidence_%':confidence
    }

import json

def save_report(result, image_path, output_dir="reports"):
    import os
    os.makedirs(output_dir, exist_ok=True)

    filename = os.path.splitext(os.path.basename(image_path))[0]
    output_path = os.path.join(output_dir, f"{filename}_report.json")

    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Report saved: {output_path}")
    return output_path

result = detect_defect("../media/images/bottles/dent1.png")
print(result) 
save_report(result,"../media/images/bottles/dent1.png")

