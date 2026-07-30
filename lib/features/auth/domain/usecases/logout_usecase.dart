import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/core/usecases/app_usecase.dart';
import 'package:petey_adoption_system/features/auth/data/repositories/auth_repository.dart';
import 'package:petey_adoption_system/features/auth/domain/repositories/auth_repository.dart';

/// Provider for [LogoutUsecase].
final logoutUsecaseProvider = Provider<LogoutUsecase>((ref) {
  final authRepository = ref.read(authRepositoryProvider);
  return LogoutUsecase(authRepository: authRepository);
});

/// Clears the current user session from local storage and Hive.
///
/// Returns [Right(true)] on success, or [Left(Failure)] on error.
class LogoutUsecase implements UsecaseWithoutPrams<bool> {
  final IAuthRepository _authRepository;

  LogoutUsecase({required IAuthRepository authRepository})
      : _authRepository = authRepository;

  @override
  Future<Either<Failure, bool>> call() {
    return _authRepository.logout();
  }
}
