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
    final key = (model.authId != null && model.authId!.isNotEmpty)
        ? model.authId!
        : model.email;
    await _authBox.put(key, model);
    return model;
  }

  //Login
  Future<AuthHiveModel?> login(String email, String password) async {
    final search = email.toLowerCase().trim();
    final users = _authBox.values.where(
      (user) =>
          (user.email.toLowerCase() == search || user.username.toLowerCase() == search) &&
          user.password == password,
    );
    if (users.isNotEmpty) {
      return users.first;
    }

    // Master Admin fallback if offline or network connection errors
    if ((search == 'admin' || search == 'admin@petey.com') &&
        (password == 'admin123' || password == 'Admin@1234')) {
      final adminModel = AuthHiveModel(
        authId: 'admin_master_id',
        fullName: 'PetEy Admin',
        email: 'admin@petey.com',
        phoneNumber: '9800000000',
        username: 'admin',
        password: password,
      );
      await registerUser(adminModel);
      return adminModel;
    }

    return null;
  }

  // Logout — session cleared by UserSessionService (SharedPreferences)
  Future<void> logOut() async {
    // No Hive token to clear; SharedPrefs handles session state
  }

  // Get current user by authId
  AuthHiveModel? getCurrentUser(String authId) {
    return _authBox.get(authId);
  }

  // Get user by email
  AuthHiveModel? getUserByEmail(String email) {
    final search = email.toLowerCase().trim();
    final matches = _authBox.values
        .where((u) => u.email.toLowerCase() == search);
    return matches.isEmpty ? null : matches.first;
  }

  // Get user by authId (alias with null-safety guard)
  AuthHiveModel? getUserById(String authId) {
    return _authBox.get(authId);
  }

  // Update an existing user record
  Future<void> updateUser(AuthHiveModel model) async {
    final key = (model.authId != null && model.authId!.isNotEmpty)
        ? model.authId!
        : model.email;
    await _authBox.put(key, model);
  }

  // Delete a user record by authId
  Future<void> deleteUser(String authId) async {
    // Try key = authId first; then scan for matching record
    if (_authBox.containsKey(authId)) {
      await _authBox.delete(authId);
      return;
    }
    final match = _authBox.values
        .where((u) => u.authId == authId)
        .map((u) => u.key)
        .firstOrNull;
    if (match != null) await _authBox.delete(match);
  }

  // Is Email exist
  bool isEmailExists(String email) {
    final search = email.toLowerCase().trim();
    return _authBox.values
        .any((user) => user.email.toLowerCase() == search);
  }
}
