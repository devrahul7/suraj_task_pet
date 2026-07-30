import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import 'package:petey_adoption_system/core/constants/hive_table_constant.dart';
import 'package:petey_adoption_system/features/auth/data/models/auth_hive_model.dart';
import 'package:path_provider/path_provider.dart';

final hiveServiceProvider = Provider<HiveService>((ref) {
  return HiveService();
});


//Singleton object

class HiveService {
  //initialize the database
  Future<void> init() async {
    //find the path of directory or database
    final directory = await getApplicationDocumentsDirectory();
    final path = '${directory.path}/${HiveTableConstant.dbName}';
    Hive.init(path);
    _registerAdapter();
    await openBoxes();
  }

  

  //Register adopters
  void _registerAdapter() {
        if (!Hive.isAdapterRegistered(HiveTableConstant.authTypeId)) {
      Hive.registerAdapter(AuthHiveModelAdapter());
    }
    //Register Other Adapter here

  }

  //Open Boxes
  Future<void> openBoxes() async {
    // await Hive.openBox<BatchHiveModel>(HiveTableConstant.batchTable);
    await Hive.openBox<AuthHiveModel>(HiveTableConstant.authTable);
  }

  //close boxes
  Future<void> close() async {
    await Hive.close();
  }

  // Batch Queries====================
  // Box<BatchHiveModel> get _batchBox =>
  //     Hive.box<BatchHiveModel>(HiveTableConstant.batchTable);

  // //Create Batch
  // Future<BatchHiveModel> createBatch(BatchHiveModel model) async {
  //   await _batchBox.put(model.batchId, model);
  //   return model;
  // }

  // //Get All Batch
  // List<BatchHiveModel> getAllBatches() {
  //   return _batchBox.values.toList();
  // }

  // //Update Batch
  // Future<void> updateBatch(BatchHiveModel model) async {
  //   await _batchBox.put(model.batchId, model);
  // }

  // //delete Batch
  // Future<void> deleteBatch(String batchId) async {
  //   await _batchBox.delete(batchId);
  // }

  //=============================Auth Queries=======================
  Box<AuthHiveModel> get _authBox =>
      Hive.box<AuthHiveModel>(HiveTableConstant.authTable);

  //Register
  Future<AuthHiveModel> registerUser(AuthHiveModel model) async {
    await _authBox.put(model.authId, model);
    return model;
  }

  //Login
  Future<AuthHiveModel?> login(String email, String password) async {
    final users = _authBox.values.where(
      (user) => user.email == email && user.password == password,
    );
    if (users.isNotEmpty) {
      return users.first;
    }
    return null;
  }

  //Logout
  Future<void> logOut() async {}

  //GetCurrenUser
  AuthHiveModel? getCurrentUser(String authId) {
    return _authBox.get(authId);
  }

  //Is Email exist
  bool isEmailExists(String email) {
    final users = _authBox.values.where((user) => user.email == email);
    return users.isNotEmpty;
  }
}
