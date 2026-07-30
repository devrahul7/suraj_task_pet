import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/features/auth/domain/usecases/login_usecase.dart';
import 'package:petey_adoption_system/features/auth/domain/usecases/reister_usecase.dart';
import 'package:petey_adoption_system/features/auth/presentation/state/auth_state.dart';



//Povider for AuthViewModel
final authViewModelProvider = NotifierProvider<AuthViewModel, AuthState>(() {
  return AuthViewModel();
});


class AuthViewModel extends Notifier<AuthState> {
  late final RegisterUsecase _registerUsecase;
  late final LoginUsecase _loginUsecase;
  //Other Usecases like getCurrentUserUsecase and logoutUsecase can be added here
  @override
  AuthState build() {
    _registerUsecase = ref.read(registerUsecaseProvider);
    _loginUsecase = ref.read(loginUsecaseProvider);
    return const AuthState();
  }

  void resetState() {
    state = const AuthState();
  }

  //Register Function
  Future<void> register({
    required String fullName,
    required String email,
    String? phoneNumber,
    required String password,
    required String username,
  }) async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      final params = RegisterUsecaseParams(
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        username: username,
      );
      final result = await _registerUsecase(params);
      result.fold(
        (failure) {
          state = state.copyWith(
            status: AuthStatus.error,
            errorMessage: failure.message,
          );
        },
        (isRegistered) async {
          if (isRegistered) {
            // Automatically log in user after registration
            await login(username: username, password: password);
          } else {
            state = state.copyWith(
              status: AuthStatus.error,
              errorMessage: "Registration failed",
            );
          }
        },
      );
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  // Login Function
  Future<void> login({
    required String username,
    required String password,
  }) async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      final params = LoginUsecaseParams(username: username, password: password);
      final result = await _loginUsecase(params);
      result.fold(
        (failure) {
          state = state.copyWith(
            status: AuthStatus.error,
            errorMessage: failure.message,
          );
        },
        (authEntity) {
          state = state.copyWith(
            status: AuthStatus.authenticated,
            authEntity: authEntity,
          );
        },
      );
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString(),
      );
    }
  }
}
