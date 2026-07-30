import 'dart:io';

import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/core/services/connectivity/network_info.dart';
import 'package:petey_adoption_system/features/dashboard/data/datasources/local/user_local_datasource.dart';
import 'package:petey_adoption_system/features/dashboard/data/datasources/remote/user_remote_datasource.dart';
import 'package:petey_adoption_system/features/dashboard/data/datasources/user_datasource.dart';
import 'package:petey_adoption_system/features/dashboard/domain/repositories/user_repository.dart';

//Provider for UserRepository
final userRepositoryProvider = Provider<IUserRepository>((ref) {
  final userRemoteDatasource = ref.read(userRemoteDatasourceProvider);
  final userLocalDatasource = ref.read(userLocalDatasourceProvider);
  final networkInfo = ref.read(networkInfoProvider);
  return UserRepository(
    userRemoteDatasource: userRemoteDatasource,
    userLocalDatasource: userLocalDatasource,
    networkInfo: networkInfo,
  );
});

class UserRepository implements IUserRepository {
  final IUserRemoteDatasource _userRemoteDatasource;
  final IUserLocalDatasource _userLocalDatasource;
  final NetworkInfo _networkInfo;
  UserRepository({
    required IUserRemoteDatasource userRemoteDatasource,
    required IUserLocalDatasource userLocalDatasource,
    required NetworkInfo networkInfo,
  }) : _userRemoteDatasource = userRemoteDatasource,
       _userLocalDatasource = userLocalDatasource,
       _networkInfo = networkInfo;

  IUserLocalDatasource get userLocalDatasource => _userLocalDatasource;
  @override
  Future<Either<Failure, String>> uploadProfileImage(File image) async {
    //Uploads only in remote data
    if (await _networkInfo.isConnected) {
      try {
        final fileName = await _userRemoteDatasource.uploadProfileImage(image);
        return Right(fileName);
      } catch (e) {
        return Left(ApiFailure(message: e.toString()));
      }
    } else {
      return Left(ApiFailure(message: 'No internet connection'));
    }
  }
}
