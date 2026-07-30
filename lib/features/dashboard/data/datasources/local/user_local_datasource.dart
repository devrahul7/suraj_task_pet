import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/services/hive/hive_service.dart';
import 'package:petey_adoption_system/features/dashboard/data/datasources/user_datasource.dart';


//Provider for UserLocalDatasource
final userLocalDatasourceProvider = Provider<IUserLocalDatasource>((ref) {
  final hiveService = ref.read(hiveServiceProvider);
  return UserLocalDatasource(hiveService: hiveService);
});
class UserLocalDatasource implements IUserLocalDatasource {
  final HiveService _hiveService;


  UserLocalDatasource({required HiveService hiveService}) :
        _hiveService = hiveService;
}