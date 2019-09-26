 function resize(sizename, maxwidth, maxheight){
    var options;
    switch (sizename) {
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
        default:
            return sharp(image).resize(options).toBuffer();
    } 
    
    
    return sharp(image).resize(options).toBuffer();
 
}

