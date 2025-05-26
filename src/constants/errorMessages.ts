export const ERROR_MESSAGES = {
  DUPLICATE_EMAIL: 'The email already exists',
  USER_NOT_FOUND: 'User Not Found',
  WRONG_PASSWORD: 'Wrong Password',
  HASH_FAILED: 'Failed to hash password',
  PASSWORD_CHECK_FAILED: 'Failed to check password',
  USER_CREATION_FAILED: 'Failed to create user',
  PASSWORD_CHANGE_FAILED: 'Failed to change password',
  DUPLICATE_EMAIL_VALIDATION_FAILED: 'Failed to validate duplicate email',
  FIND_USER_FAILED: 'Failed to find user by email',
  LOG_IN_FAILED: 'Failed to log in',
  USER_ROLE_MISMATCH: 'User role mismatch',
};

export const RESTAURANT_ERROR_MESSAGES = {
  RESTAURANT_NOT_FOUND: 'Restaurant Not Found',
  RESTAURANT_CREATION_FAILED: 'Failed to create restaurant',
  RESTAURANT_FETCHING_FAILED: 'Failed to fetch restaurant',
  RESTAURANTS_FETCHING_FAILED: 'Failed to fetch restaurants',
  USER_ALREADY_OWNS_RESTAURANT: 'User already owns a restaurant',
};

export const DISH_ERROR_MESSAGES = {
  DISH_CREATION_FAILED: 'Failed to create dish',
  DISH_FETCHING_FAILED: 'Failed to fetch dish',
  DISHES_FETCHING_FAILED: 'Failed to fetch dishes',
  DISH_DELETION_FAILED: 'Failed to delete dish',
  USER_DOES_NOT_OWN_RESTAURANT: 'User does not own a restaurant',
  DISH_NOT_FOUND: 'Dish Not Found',
};
