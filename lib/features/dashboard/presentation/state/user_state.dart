import 'package:equatable/equatable.dart';
import 'package:petey_adoption_system/features/dashboard/domain/usecases/upload_photo_usecase.dart';

enum UserStatus { initial, loading, loaded, error, created, updated, deleted }

class UserState extends Equatable {
  //Store the profile image name temprorily until the user is saved to the database
  final String? profileImageName;
  final UserStatus status;
  final String? errorMessage;

  const UserState({
    this.profileImageName,
    this.status = UserStatus.initial,
    this.errorMessage,
  });

  UserState copyWith({
    String? profileImageName,
    UserStatus? status,
    String? errorMessage,
  }) {
    return UserState(
      profileImageName: profileImageName ?? this.profileImageName,
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [profileImageName, status, errorMessage];
}
