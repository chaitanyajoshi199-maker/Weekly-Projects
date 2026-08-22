-bottle.png'
    # Try others: 'dent-bottle.png', 'brust-bottle.png', 'scratch-bottle.png', 'spark-bottle.png', 'stain.png', 'bottle.png'

    test_image_path = os.path.join(SCRIPT_DIR, 'test images', test_image_name)

    result = detect_defects(REFERENCE_IMAGE_PATH, test_image_path)

    if result is not None:
        imshow('Defect Inspection (Left: Result | Right: Diff Mask)', result)
        waitKey(0)
        destroyAllWindows()
    print('done')