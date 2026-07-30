import 'package:flutter/material.dart';

/// Handy [BuildContext] extensions used across the PetEy UI.
extension ContextExtensions on BuildContext {
  // ─── Screen Dimensions ─────────────────────────────────────────────
  /// Full screen width.
  double get screenWidth => MediaQuery.of(this).size.width;

  /// Full screen height.
  double get screenHeight => MediaQuery.of(this).size.height;

  /// Top padding (status bar / notch).
  double get topPadding => MediaQuery.of(this).padding.top;

  /// Bottom padding (home indicator / nav bar).
  double get bottomPadding => MediaQuery.of(this).padding.bottom;

  // ─── Responsive Breakpoints ────────────────────────────────────────
  /// Returns true when screen width is ≥ 600 dp (tablet / large phone).
  bool get isTablet => screenWidth >= 600;

  // ─── Theme Shortcuts ───────────────────────────────────────────────
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
  ColorScheme get colorScheme => Theme.of(this).colorScheme;
  bool get isDarkMode => Theme.of(this).brightness == Brightness.dark;

  // ─── Navigation Shortcuts ──────────────────────────────────────────
  /// Push a new route.
  Future<T?> push<T>(Widget page) =>
      Navigator.of(this).push<T>(MaterialPageRoute(builder: (_) => page));

  /// Replace the current route.
  Future<T?> pushReplacement<T>(Widget page) =>
      Navigator.of(this).pushReplacement<T, void>(
        MaterialPageRoute(builder: (_) => page),
      );

  /// Pop the current route.
  void pop<T>([T? result]) => Navigator.of(this).pop<T>(result);

  /// Pop all routes and push a new one.
  Future<T?> pushAndRemoveUntil<T>(Widget page) =>
      Navigator.of(this).pushAndRemoveUntil<T>(
        MaterialPageRoute(builder: (_) => page),
        (route) => false,
      );

  // ─── SnackBar Shortcuts ────────────────────────────────────────────
  /// Show a brief informational snackbar.
  void showSnackBar(String message, {Color? backgroundColor}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  /// Show a success snackbar (green).
  void showSuccessSnackBar(String message) =>
      showSnackBar(message, backgroundColor: Colors.green.shade700);

  /// Show an error snackbar (red).
  void showErrorSnackBar(String message) =>
      showSnackBar(message, backgroundColor: Colors.red.shade700);
}
