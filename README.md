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
```ruby 
'pod FontAwesomeKit/Core'
``` 


4) Subclass FAKIcon and override this method as below:
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

5) And override this method as below. This is where the magic happens. In this method, we will load up the json mapping file that we generated in step 2 to map the human-friendly identifiers (like "fa-search") to their computer-friendly character codes (like "f028").

```objective-c
+ (NSDictionary *)allIcons
{
    NSString *path = [[NSBundle bundleForClass:self] pathForResource:@"FONT_NAME_font_map" ofType:@"json"];
    NSData *jsonData = [NSData dataWithContentsOfFile:path];
    
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:nil];
    return json;
}
```

6) To use a custom Fort Awesome icon in your app, just call this method and pass in your identifier.
```objective-c
+ (instancetype)iconWithIdentifier:(NSString *)identifier size:(CGFloat)size error:(NSError **)error;
```

7) You can check out the [FontAwesomeKit Cocoapod](https://github.com/PrideChung/FontAwesomeKit) for more details on how to use font icons in your app, but generally you'll either want to create an attributed string or an image from an FAKIcon instance, and then use those in a UILabel, UITextView, or UIImageView. See 
```objective-c 
- (NSAttributedString *)attributedString;
``` 
and 
```objective-c
- (UIImage *)imageWithSize:(CGSize)imageSize;
```


## Android:

1) Download your .ttf font file from Fort Awesome, add it to your Android Studio project into the src/main/assets folder (or wherever you prefer). 


2) Go to your Fort Awesome dashboard, copy the ID at the end of the url, and paste it [here](https://knotlabs.github.io/fort-awesome-everywhere/). Then click **Export XML Map**, copy the XML, paste it into a text file, and save it as ```icons.xml``` (or whatever you prefer). Add this string resource XML file to your Android Studio project in the res/values folder. 


3) Add the [Fonticon library](https://github.com/shamanland/fonticon) to your project. If you use Gradle: 
```groovy
dependencies {
    compile 'com.shamanland:fonticon:0.1.9'
}
```
