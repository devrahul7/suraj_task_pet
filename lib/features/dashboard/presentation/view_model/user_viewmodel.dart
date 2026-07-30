import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/features/dashboard/domain/usecases/upload_photo_usecase.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/state/user_state.dart';


//Provider for UserViewModel
final userViewModelProvider = NotifierProvider<UserViewModel, UserState>(() {
  return UserViewModel();
});


class UserViewModel extends Notifier<UserState> {
  late final UploadPhotoUseCase _uploadPhotoUsecase;

  @override
  UserState build() {
    _uploadPhotoUsecase = ref.read(uploadPhotoUseCaseProvider);
    return const UserState();
  }

  Future<void> uploadProfileImage(File image) async {
    state = state.copyWith(status: UserStatus.loading);
    final result = await _uploadPhotoUsecase(image);
    result.fold(
      (failure) {
        // Handle failure
        state = state.copyWith(status: UserStatus.error, errorMessage: failure.message);
      },
      (fileName) {
        // Handle success
        state = state.copyWith(status: UserStatus.loaded, profileImageName: fileName);
      },
    );
  }
}