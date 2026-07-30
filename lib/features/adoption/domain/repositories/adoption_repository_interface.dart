import 'package:dartz/dartz.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/features/adoption/domain/entities/adoption_entity.dart';

abstract class IAdoptionRepository {
  Future<Either<Failure, List<AdoptionEntity>>> getUserAdoptions(String userEmail);
  Future<Either<Failure, bool>> createAdoptionRequest(AdoptionEntity entity);
  Future<Either<Failure, bool>> updateAdoptionStatus(String id, String status, String note);
}
