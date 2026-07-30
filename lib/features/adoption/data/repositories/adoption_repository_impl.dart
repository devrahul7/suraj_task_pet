import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/features/adoption/data/datasources/adoption_datasource.dart';
import 'package:petey_adoption_system/features/adoption/data/datasources/local/adoption_local_datasource.dart';
import 'package:petey_adoption_system/features/adoption/domain/entities/adoption_entity.dart';
import 'package:petey_adoption_system/features/adoption/domain/repositories/adoption_repository_interface.dart';

final adoptionRepositoryProvider = Provider<IAdoptionRepository>((ref) {
  return AdoptionRepositoryImpl(
    localDatasource: ref.read(adoptionLocalDatasourceProvider),
  );
});

class AdoptionRepositoryImpl implements IAdoptionRepository {
  final IAdoptionDatasource localDatasource;

  AdoptionRepositoryImpl({required this.localDatasource});

  @override
  Future<Either<Failure, List<AdoptionEntity>>> getUserAdoptions(String userEmail) async {
    try {
      final list = await localDatasource.getUserAdoptions(userEmail);
      return Right(list);
    } catch (e) {
      return Left(LocalDatabaseFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> createAdoptionRequest(AdoptionEntity entity) async {
    try {
      final success = await localDatasource.createAdoptionRequest(entity);
      return Right(success);
    } catch (e) {
      return Left(LocalDatabaseFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> updateAdoptionStatus(String id, String status, String note) async {
    try {
      final success = await localDatasource.updateAdoptionStatus(id, status, note);
      return Right(success);
    } catch (e) {
      return Left(LocalDatabaseFailure(message: e.toString()));
    }
  }
}
