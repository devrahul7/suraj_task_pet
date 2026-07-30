import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/core/usecases/app_usecase.dart';
import 'package:petey_adoption_system/features/auth/data/repositories/auth_repository.dart';
import 'package:petey_adoption_system/features/auth/domain/entities/auth_entity.dart';
import 'package:petey_adoption_system/features/auth/domain/repositories/auth_repository.dart';

class RegisterUsecaseParams extends Equatable {
  final String fullName;
  final String email;
  final String? phoneNumber;
  final String? password;
  final String username;
  
  

  const RegisterUsecaseParams({
    required this.fullName,
    required this.email,
    this.phoneNumber,
    this.password,
    required this.username,
    
  });
  
  @override
  
  List<Object?> get props => [
    fullName,
    email,
    phoneNumber,
    password,
    username,
    
  ];
}


//Provider for register usecase
final registerUsecaseProvider = Provider<RegisterUsecase>((ref) {
  final authRepository = ref.read(authRepositoryProvider);
  return RegisterUsecase(authRepository: authRepository);
  
});
class RegisterUsecase implements UsecaseWithParams<bool, RegisterUsecaseParams> {
  final IAuthRepository _authRepository;

  RegisterUsecase({required IAuthRepository authRepository}) : _authRepository = authRepository;
  @override
  Future<Either<Failure, bool>> call(RegisterUsecaseParams params){
    final entity = AuthEntity(
      fullName: params.fullName,
      email: params.email,
      phoneNumber: params.phoneNumber ?? '',
      password: params.password,
      username: params.username,
      
    );
    return _authRepository.register(entity);
  }
  
}