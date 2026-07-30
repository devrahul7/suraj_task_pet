import 'dart:io';

import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/core/usecases/app_usecase.dart';
import 'package:petey_adoption_system/features/dashboard/data/repositories/user_repository.dart';
import 'package:petey_adoption_system/features/dashboard/domain/repositories/user_repository.dart';


//Provider for UploadPhotoUseCase
final uploadPhotoUseCaseProvider = Provider<UploadPhotoUseCase>((ref) {
  final userRepository = ref.read(userRepositoryProvider);
  return UploadPhotoUseCase(userRepository);
});

class UploadPhotoUseCase implements UsecaseWithParams<String, File> {
   final IUserRepository _userRepository;
   UploadPhotoUseCase(this._userRepository);

  @override
   Future<Either<Failure, String>> call(File params) async {
     return await _userRepository.uploadProfileImage(params);
   }
 }