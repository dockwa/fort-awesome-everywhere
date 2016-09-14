# fort-awesome-everywhere
Fort Awesome on the web, iOS, and Andriod, for fun and profit!

But why?
* Are you tired of having 6,000,000 pngs floating around your iOS and Android projects? Are you tired of having to resize your images for @2x, @3x, hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi, etc?
* Are you tired of having to keep your image assets in sync across three different platforms at endless sizes and densities?
* Do you wish you could instead use a single file that stored all of your images and icons, at _infinite_ resolution, future proofed for any new device sizes and screen technologies? 
* Do you wish you could change the color of your icons by simply specifying a color in a layout file or code? 

But how? This sounds too good to be true...

**Fear not friends, there is a solution to all of your above problems and wishes! By using a custom Fort Awesome icon font and this simple script and tutorial, you can enjoy all of these benefits with barely any effort.**

Without further ado...

## iOS:

1) Download your .ttf font file from Fort Awesome, add it to your Xcode project.


2) Go to your Fort Awesome dashboard, copy the ID at the end of the url, and paste it [here](https://knotlabs.github.io/fort-awesome-everywhere/). Then click **Export JSON Map**, copy the JSON, paste it into a text file, and save it as ```FONT_NAME_font_map.json``` (or whatever you prefer). Add this JSON file to your Xcode project. 


3) Add the [FontAwesomeKit Cocoapod](https://github.com/PrideChung/FontAwesomeKit) to your project.


2) Subclass FAKIcon and override this method as below:
```objective-c
+ (UIFont *)iconFontWithSize:(CGFloat)size
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self registerIconFontWithURL:[[NSBundle mainBundle] URLForResource:@"YOUR_FONT_FILE_NAME" withExtension:@"ttf"]];
    });
    
    UIFont *font = [UIFont fontWithName:@"YOUR_FORT_AWESOME_FONT_NAME" size:size];
    NSAssert(font, @"UIFont object should not be nil, check if the font file is added to the application bundle and you're using the correct font name.");
    return font;
}
```

3) And override this method as below. This is where the magic happens. In this method, we will load up the json mapping file that we generated in step 2 to map the human-friendly identifiers (like "fa-search") to their computer-friendly character codes (like "f028").

```objective-c
+ (NSDictionary *)allIcons
{
    NSString *path = [[NSBundle bundleForClass:self] pathForResource:@"FONT_NAME_font_map" ofType:@"json"];
    NSData *jsonData = [NSData dataWithContentsOfFile:path];
    
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:nil];
    return json;
}
```

4) To use a custom Fort Awesome icon in your app, just call this method and pass in your identifier. So easy! So Magic!
```objective-c
+ (instancetype)iconWithIdentifier:(NSString *)identifier size:(CGFloat)size error:(NSError **)error;
```

5) Profit
