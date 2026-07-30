import 'package:petey_adoption_system/features/auth/domain/entities/auth_entity.dart';

class AuthApiModel {
  final String? id;  
  final String fullName;
  final String email;
  final String phoneNumber;
  final String username;
  final String? password;
  final String? address;
  final String? profileImage;
  final String? location;
  final String? role;


  AuthApiModel({
    this.id,
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    required this.username,
    this.password,
    this.address,
    this.profileImage,
    this.location,
    this.role,
  });

  //toJson — only includes fields accepted by the backend register endpoint
  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{
      'fullName': fullName,
      'email': email,

      'username': username,





    };
    if (password != null) json['password'] = password;
    if (phoneNumber.isNotEmpty) json['phoneNumber'] = phoneNumber;
    if (address != null) json['address'] = address;
    if (profileImage != null) json['profileImage'] = profileImage;
    if (location != null) json['location'] = location;
    return json;
  }

  //fromJson
  factory AuthApiModel.fromJson(Map<String, dynamic> json) {
    return AuthApiModel(
      id: json['_id'] as String?,
      fullName: json['fullName'] as String,
      email: json['email'] as String,
      phoneNumber: (json['phoneNumber'] as String?) ?? '',
      username: json['username'] as String,
      address: json['address'] as String?,
      profileImage: json['profileImage'] as String?,
      location: json['location'] as String?,
      role: json['role'] as String?,
    );
  }

  //toEntity
  AuthEntity toEntity() {
    return AuthEntity(
      authId: id,
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      username: username,
      password: password,
      address: address,
      profilePicture: profileImage,
      location: location,
      role: role,
    );
  }

  //fromEntity
  factory AuthApiModel.fromEntity(AuthEntity entity) {
    return AuthApiModel(
      fullName: entity.fullName,
      email: entity.email,
      phoneNumber: entity.phoneNumber,
      username: entity.username,
      password: entity.password,
      address: entity.address,
      profileImage: entity.profilePicture,
      location: entity.location,
      role: entity.role,
    );
  }


  //toEntityList
  static List<AuthEntity> toEntityList(List<AuthApiModel> models) {
    return models.map((model) => model.toEntity()).toList();
  }


}