import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/utils/snackbar_utils.dart';
import 'package:petey_adoption_system/features/auth/presentation/pages/register_page.dart';
import 'package:petey_adoption_system/features/auth/presentation/state/auth_state.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_dashboard_screen.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/dashboard_screen.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool isLoading = false;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (_formKey.currentState?.validate() ?? false) {
      await ref
          .read(authViewModelProvider.notifier)
          .login(
            username: _usernameController.text.trim(),
            password: _passwordController.text.trim(),
          );
    }
  }

  void navigateToRegister() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => RegisterPage()));
  }
  // void _login() {
  //   if (_formKey.currentState?.validate() ?? false) {
  //     Navigator.pushReplacement(// the previous rout is disposed after the successful anmation
  //       context,
  //       MaterialPageRoute(builder: (_) =>  DashboardScreen()),
  //     );
  //   }
  // }

  void _register() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => RegisterPage()));
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final TextColor =
        Theme.of(context).textTheme.bodyMedium?.color ?? Colors.black;
    final secondaaryTextColor =
        Theme.of(context).textTheme.bodySmall?.color ??
        Colors.black;

    //state listener for auth state changes
    final authState = ref.watch(authViewModelProvider);

    ref.listen<AuthState>(authViewModelProvider, (previous, next) {
      if (next.status == AuthStatus.error && next.errorMessage != null) {
        SnackbarUtils.showError(context, next.errorMessage!);
      } else if (next.status == AuthStatus.authenticated) {
        SnackbarUtils.showSuccess(context, "Login successful");
        final isAdmin = next.authEntity?.role?.toUpperCase() == 'ADMIN';
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) =>
                isAdmin ? const AdminDashboardScreen() : const DashboardScreen(),
          ),
        );
      }
    });

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Image.asset('assets/images/photo.png', height: 200),
                  ),
                  SizedBox(height: 20),
                  Center(
                    child: Text(
                      "Login PetEy",
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(height: 25),
                  TextFormField(
                    controller: _usernameController,
                    decoration: InputDecoration(
                      labelText: "Email Address",
                      hintText: "Enter your email Address",
                      prefixIcon: Icon(Icons.email),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return "Please enter email";
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 10), 

                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: "Password",
                      hintText: "Enter your password",
                      prefixIcon: Icon(Icons.lock),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),

                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility
                              : Icons.visibility_off,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return "Please enter password";
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 10),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {},
                      child: Text("Forget Password?"),
                    ),
                  ),
                  SizedBox(height: 15),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.brown,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      onPressed: _login,
                      child: authState.status == AuthStatus.loading
                          ? CircularProgressIndicator(
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            )
                          : Text(
                              "Login",
                              style: TextStyle(
                                fontSize: 20,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                  SizedBox(height: 20),
                  Center(child: Text("Or Sign up with ")),
                  SizedBox(height: 15),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      socialButton(Icons.g_mobiledata, Colors.red),
                      SizedBox(width: 15),
                      socialButton(Icons.facebook, Colors.blue),
                      SizedBox(width: 15),
                      socialButton(Icons.apple, Colors.black),
                    ],
                  ),

                  SizedBox(height: 20),
                  // Register
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Don’t have a account? "),
                      TextButton(
                        onPressed: _register,
                        child: Text(
                          "Register Now",
                          style: TextStyle(
                            color: Colors.orange,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  SizedBox(height: 70),

                  // Bottom Image (Dog)
                  Center(
                    child: Image.asset('assets/images/billo.png', height: 200),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget socialButton(IconData icon, Color color) {
    return CircleAvatar(
      radius: 25,
      backgroundColor: Colors.grey.shade200,
      child: Icon(icon, color: color, size: 40),
    );
  }
}
