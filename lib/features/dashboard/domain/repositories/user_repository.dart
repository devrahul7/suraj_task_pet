import 'dart:io';

import 'package:dartz/dartz.dart';
import 'package:petey_adoption_system/core/error/failures.dart';


abstract interface class IUserRepository {
  //Image Upload
  Future<Either<Failure,String>> uploadProfileImage(File image);
}