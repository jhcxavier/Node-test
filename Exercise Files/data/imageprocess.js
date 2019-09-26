function processImage(image, size, maxwidth, maxheight) {

    var width = maxwidth;
    var height = maxheight;
    if (size == 'cropped' ||
        size == 'thumb' ||
        size == 'medium' ||
        size == 'standard' ||
        size == 'vertical_standard' ||
        size == 'vertical_medium' ||
        size == 'horizontal_medium') {
    
        return sharp(image).metadata().then(features => {
    
            var w_cropPixels = (features.width < features.height) ? features.width : features.height,
                h_cropPixels = (features.width < features.height) ? features.width : features.height
            var options;
                //
                switch (size) {
                    case "thumb":
                            options = {
                                width: maxwidth,
                                height: maxheight,
                                fit: sharp.fit.cover,
                                position: sharp.strategy.entropy
                            }
                            break;
                    case "medium":
                            options = {
                                width: maxwidth,
                                height: maxheight,
                                fit: sharp.fit.cover,
                                position: sharp.strategy.entropy
                            }
                            break;
                    case "standard":
                                options = {
                                    width: maxwidth,
                                    height: maxheight,
                                    fit: sharp.fit.cover,
                                    position: sharp.strategy.entropy
                                }
                                break;
                    case "horizontal_medium":
                        options = {
                            width: maxwidth,
                            height: maxheight,
                            fit: sharp.fit.cover,
                            position: sharp.strategy.entropy
                        }
                        break;
                    case "vertical_medium":
                        options = {
                            width: maxwidth,
                            height: maxheight,
                            fit: sharp.fit.cover,
                            position: sharp.strategy.entropy
                        }
                        break; 
                    case "vertical_standart":
                            options = {
                                width: maxwidth,
                                height: maxheight,
                                fit: sharp.fit.cover,
                                position: sharp.strategy.entropy
                            }
                        break;
                    default:{
                        width = w_cropPixels;
                        height = h_cropPixels;
                    }
                } 
                return sharp(image).resize(options).toBuffer(); 
            })
        }
    //Else for the conditional started in line 5
    else {
        return sharp(image).resize(width, height).toBuffer();
    }
}