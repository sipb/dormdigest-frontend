

const CATEGORIES_COLORS = {
  'OTHER': "gray",
  'FOOD': "#d92120",
  'CAREER': "#e7732f",
  'FUNDRAISING': "#dbab3b",
  'APPLICATION': "#b4bd4c",
  'PERFORMANCE': "#83ba6d",
  'BOBA': "#5ba7a6",
  'TALKS': "#447cbf",
  'SALE': "#413992",
  'RSVP': "#781c81"
}

const DEFAULT_CATEGORY = 'OTHER'; //If an event doesn't have any tags, we will assign it this category

const CATEGORIES = Object.keys(CATEGORIES_COLORS); //Name of all available categories
class Categories {
  static getCategoriesColorMapping() {
    //Return mapping of category name to its corresponding color
    return CATEGORIES_COLORS;
  }
  static getCategoriesList() {
    //Return list of available categories
    return CATEGORIES;
  }

  static getDefaultCategoryTags() {
    //Return a list of integers representing the default category (normally 'Other')
    const DEFAULT_CATEGORY_INDEX = CATEGORIES.indexOf(DEFAULT_CATEGORY);
    return [DEFAULT_CATEGORY_INDEX];
  }

  static getCategoriesStringMapping(category_ints) {
    //Returns list of category names given a list of category integers
    let category_strings = []
    for (let category of category_ints) {
      category_strings.push(CATEGORIES[category]);
    }
    return category_strings
  }

  static getCategoriesIntMapping(category_strings) {
    //Returns list of category int representations given a list of cateogry strings
    let category_ints = []
    for (let category of category_strings) {
      category_ints.push((CATEGORIES.indexOf(category)));
    }
    return category_ints
  }

  static getCategoriesEmptyFrequency() {
    //Returns mapping of category name to 0 (to be used as a starting frequency list)
    const frequency = {};
    for (const category of CATEGORIES) {
      frequency[category] = 0;
    }
    return frequency;
  }

  static parseCategoryNameFrequency(categoryNumFrequency) {
    //Given a object mapping category names => their frequency (doesn't necessarily contain all categories),
    //return a object mapping category names => their frequency (with all categories)
    const categoryNameFrequency = this.getCategoriesEmptyFrequency(); //Initialize full category object of zeroes (IMPORTANT)

    for (const [categoryName, categoryFrequency] of Object.entries(categoryNumFrequency)) {
      categoryNameFrequency[categoryName] = categoryFrequency;
    };
    return categoryNameFrequency;
  }
}

export default Categories;
