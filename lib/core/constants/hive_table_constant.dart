class HiveTableConstant {
  //Private constructor to prevent instanttiation
  HiveTableConstant._();
  //Database Name
  static const String dbName = "PetEy-pet-adoption-system-db";

  //Table name: Box name in hive
  //We must give an indexing  Id to each table
  static const int authTypeId = 0;
  static const String authTable = "auth_table";

  static const int petTypeId = 1;
  static const String petTable = "pet_table";

  static const int adoptionRequestTypeId = 2;
  static const String adoptionRequestTable = "adoption_request_table";

  static const int favouriteTypeId = 3;
  static const String favouriteTable = "favourite_table";

  static const int wishListTypeId = 4;
  static const String wishListTable = "wish_list_table";

  static const int feedbackTypeId = 5;
  static const String feedbackTable = "feedback_table";
}
