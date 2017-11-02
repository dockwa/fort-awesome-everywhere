public class Icon {

    //Properties
    private String identifier;
    private int color = 0;

    //Constructor
    public Icon(String identifier, int color) {
        this.identifier = identifier;
        this.color = color;
    }

    //Getters
    public String getIdentifier() { return identifier != null ? identifier : ""; }
    public int getColor() { return color; }

    //Call setText with the result of this method.
    public String getIconCode(Context context) { return Icon.iconCode(identifier, context); }



    //Public

    //Cal this on the Button or TextView before you display an Icon.
    public static void setTypefaceAsIconFont(Context context, View view) {
        if (view.isInEditMode()) { return; }
        if (view instanceof TextView) {
            ((TextView) view).setTypeface(getTypeface(context));
        }
    }

    //Call setText with the result of this method.
    public static String iconCode(String identifier, Context context) {
        if (identifier == null) { return ""; }

        String linted = lintIdentifier(identifier);

        int resID = context.getResources().getIdentifier(context.getPackageName() + ":string/" + linted, null, null);
        if (resID == 0) { return ""; }

        return context.getResources().getString(resID);
    }



    //Helpers

    private static Typeface getTypeface(Context context) {
        return Typeface.createFromAsset(context.getAssets(), "Dockwa.ttf");
    }

    private static String lintIdentifier(String identifier) {
        String lowercase = identifier.toLowerCase();
        String removeAmpersand = lowercase.replace("&", "and");
        String removeSlash = removeAmpersand.replace("/", "_");
        String hyphencase = removeSlash.replace(" ", "_");
        return hyphencase.replace("-", "_");
    }
}
