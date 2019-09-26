function resizeImage(sizename, maxwidth, maxheight){
    var options;
    switch (sizename) {
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
}