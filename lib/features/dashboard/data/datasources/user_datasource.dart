import 'dart:io';

abstract interface class IUserLocalDatasource {

}
 
abstract interface class IUserRemoteDatasource {
  Future<String> uploadProfileImage(File image);

}