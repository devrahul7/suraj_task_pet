import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/features/adoption/data/repositories/adoption_repository_impl.dart';
import 'package:petey_adoption_system/features/adoption/domain/entities/adoption_entity.dart';
import 'package:petey_adoption_system/features/adoption/domain/repositories/adoption_repository_interface.dart';

final getUserAdoptionsUsecaseProvider = Provider<GetUserAdoptionsUsecase>((ref) {
  return GetUserAdoptionsUsecase(repository: ref.read(adoptionRepositoryProvider));
});

class GetUserAdoptionsUsecase {
  final IAdoptionRepository repository;

  GetUserAdoptionsUsecase({required this.repository});

  Future<Either<Failure, List<AdoptionEntity>>> call(String userEmail) {
    return repository.getUserAdoptions(userEmail);
  }
}
