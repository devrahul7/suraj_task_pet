import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiEndpoints {
  ApiEndpoints._();

  static const bool isPhysicalDevice = true; // Enabled for physical phone on Wi-Fi
  static const String compIpAddress = '192.168.1.65';

  // Get the base URL based on the platform
  static String get baseUrl {
    if (kIsWeb || Platform.isWindows || Platform.isMacOS || Platform.isLinux) {
      return 'http://localhost:5000/api/v1';
    }
    if (Platform.isAndroid) {
      // Use 10.0.2.2 for Android emulator, or compIpAddress for physical device
      return isPhysicalDevice
          ? 'http://$compIpAddress:5000/api/v1'
          : 'http://10.0.2.2:5000/api/v1';
    }
    return 'http://$compIpAddress:5000/api/v1';
  }

  static const Duration connectionTimeout = Duration(seconds: 5);
  static const Duration receiveTimeout = Duration(seconds: 5);

  // =========== Auth Endpoints ===========
  // static const String userLogin = '/users/login';
  // static const String userRegister = '/users/register';
  // static const String userLogout = '/users/logout';
  // static const String checkEmail = '/users/check-email';

  static const String userLogin = '/users/login';
  static const String userRegister = '/users/register';
  static const String userLogout = '/users/logout';
  static const String checkEmail = '/users/check-email';

  // ============Image Upload Endpoint=================
  // static const String uploadImage = '/users/upload-profile-image';
  static const String uploadImage = '/auth/upload-profile-image';


  // =========== Pet Endpoints ===========
  static const String pets = '/pets';
  static String petUploadImage(String petId) => '/pets/$petId/uploadPetImage';
  static String petById(String id) => '/pets/$id';
  static String petAdopt(String id) => '/pets/$id/adopt';

  //====================Adoption Request Endpoints======================
  static const String adoptionRequests = '/adoption-requests';
  static String adoptionRequestById(String id) => '/adoption-requests/$id';
  static String adoptionRequestByUser(String userId) =>
      '/adoption-requests/user/$userId';
  static String adoptionRequestByPet(String petId) =>
      '/adoption-requests/pet/$petId';

  // =========== Favourite Endpoints ===========
  static const String favourites = '/favourites';
  static String favouriteById(String id) => '/favourites/$id';
  static String favouriteByUser(String userId) => '/favourites/user/$userId';
  static String favouriteByPet(String petId) => '/favourites/pet/$petId';

  //=================WishList Endpoints   ========================
  //Note: WishList is different from Favourite. WishList is for pets that users are interested in but not ready to adopt yet,
  //while Favourite is for pets that users have already adopted or are planning to adopt soon.
  static const String wishLists = '/wishlists';
  static String wishListById(String id) => '/wishlists/$id';
  static String wishListByUser(String userId) => '/wishlists/user/$userId';
  static String wishListByPet(String petId) => '/wishlists/pet/$petId';

  //=================Feedback Endpoints   ========================
  static const String feedbacks = '/feedbacks';
  static String feedbackById(String id) => '/feedbacks/$id';
  static String feedbackByUser(String userId) => '/feedbacks/user/$userId';
  static String feedbackByPet(String petId) => '/feedbacks/pet/$petId';

  // =========== Comment Endpoints ===========
  static const String comments = '/comments';
  static String commentById(String id) => '/comments/$id';
  static String commentsByItem(String itemId) => '/comments/item/$itemId';
  static String commentLike(String id) => '/comments/$id/like';
}
