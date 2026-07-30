import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:petey_adoption_system/app/routes/app_routes.dart';
import 'package:petey_adoption_system/app/theme/app_colors.dart';
import 'package:petey_adoption_system/app/theme/theme_extensions.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/core/utils/snackbar_utils.dart';
import 'package:petey_adoption_system/features/auth/presentation/pages/login_page.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/view_model/user_viewmodel.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  final bool isAdmin;
  const SettingsScreen({super.key, this.isAdmin = false});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  final ImagePicker _imagePicker = ImagePicker();
  File? _avatarFile;
  bool _isUploadingMedia = false;

  Future<bool> _userPermission(Permission permission) async {
    final status = await permission.status;
    if (status.isGranted || status.isLimited) return true;
    if (status.isDenied) {
      final result = await permission.request();
      return result.isGranted || result.isLimited;
    }
    if (status.isPermanentlyDenied) {
      if (mounted) _showPermissionDeniedDialog();
      return false;
    }
    return false;
  }

  void _showPermissionDeniedDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Permission Required'),
        content: const Text(
          'Please allow photo library access to update your profile picture.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              openAppSettings();
            },
            child: const Text('Open Settings'),
          ),
        ],
      ),
    );
  }

  Future<void> _pickFromGallery() async {
    final hasPermission = await _userPermission(Permission.photos);
    if (!hasPermission) return;

    try {
      final XFile? pickedFile = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
      );
      if (pickedFile != null) {
        setState(() {
          _avatarFile = File(pickedFile.path);
          _isUploadingMedia = true;
        });
        await Future.delayed(const Duration(seconds: 1));
        if (mounted) {
          await ref
              .read(userViewModelProvider.notifier)
              .uploadProfileImage(File(pickedFile.path));
          setState(() => _isUploadingMedia = false);
          if (mounted) {
            SnackbarUtils.showSuccess(context, 'Profile picture updated!');
          }
        }
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
      if (mounted) {
        setState(() => _isUploadingMedia = false);
        SnackbarUtils.showError(context, 'Failed to pick image');
      }
    }
  }

  void _showEditProfileModal(
      String currentName, String currentEmail, String currentPhone) {
    final nameCtrl = TextEditingController(text: currentName);
    final emailCtrl = TextEditingController(text: currentEmail);
    final phoneCtrl = TextEditingController(text: currentPhone);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Edit Profile Information',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),

              // Read-only Email Field (Email cannot be changed once created)
              TextField(
                controller: emailCtrl,
                readOnly: true,
                enabled: false,
                decoration: InputDecoration(
                  labelText: 'Email Address (Read Only)',
                  helperText: 'Email address cannot be changed once created',
                  helperStyle: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                  prefixIcon: const Icon(Icons.email, color: Colors.grey),
                  border: const OutlineInputBorder(),
                  filled: true,
                  fillColor: Colors.grey.shade100,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  prefixIcon: Icon(Icons.phone),
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    final nav = Navigator.of(context);
                    final session = ref.read(userSessionServiceProvider);
                    await session.saveUserSession(
                      userId: session.getUserId() ?? '',
                      username: session.getUsername() ?? nameCtrl.text.trim(),
                      email: currentEmail, // Keep original email
                      phoneNumber: phoneCtrl.text.trim(),
                      fullName: nameCtrl.text.trim(),
                      role: session.getUserRole(),
                    );
                    if (mounted) {
                      setState(() {});
                      nav.pop();
                      messenger.showSnackBar(
                        const SnackBar(
                          content: Text('Profile updated successfully!'),
                          backgroundColor: Colors.green,
                        ),
                      );
                    }
                  },
                  child: const Text(
                    'Save Changes',
                    style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.logout, color: Colors.red),
            SizedBox(width: 8),
            Text('Logout', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        content: Text(
          widget.isAdmin
              ? 'Are you sure you want to logout from the Admin Panel?'
              : 'Are you sure you want to logout from your account?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              Navigator.pop(context);
              await ref.read(userSessionServiceProvider).clearUserSession();
              if (context.mounted) {
                AppRoutes.pushAndRemoveUntil(context, const LoginPage());
              }
            },
            child: const Text('Logout',
                style:
                    TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final session = ref.watch(userSessionServiceProvider);
    final authEntity = ref.watch(authViewModelProvider).authEntity;

    final defaultName = widget.isAdmin ? 'PetEy Admin' : 'PetEy User';
    final defaultEmail = widget.isAdmin ? 'admin@petey.com' : 'user@petey.com';

    final fullName =
        session.getUserFullName() ?? authEntity?.fullName ?? defaultName;
    final email =
        session.getUserEmail() ?? authEntity?.email ?? defaultEmail;
    final phone = session.getUserPhoneNumber() ?? authEntity?.phoneNumber ?? '';
    final biometricEnabled = session.isBiometricEnabled();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // ── Header gradient (Deep Orange Theme) ──
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(40),
                    bottomRight: Radius.circular(40),
                  ),
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.settings, color: Colors.white, size: 24),
                        const SizedBox(width: 8),
                        Text(
                          widget.isAdmin ? 'Admin Settings' : 'Settings',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            fontFamily: 'OutfitBold',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Avatar
                    Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 4),
                            boxShadow: const [
                              BoxShadow(
                                color: AppColors.black20,
                                blurRadius: 20,
                                offset: Offset(0, 10),
                              ),
                            ],
                          ),
                          child: CircleAvatar(
                            radius: 54,
                            backgroundColor: Colors.white,
                            backgroundImage:
                                _avatarFile != null ? FileImage(_avatarFile!) : null,
                            child: _avatarFile == null
                                ? Icon(
                                    widget.isAdmin
                                        ? Icons.admin_panel_settings
                                        : Icons.person_rounded,
                                    size: 54,
                                    color: Colors.deepOrange,
                                  )
                                : null,
                          ),
                        ),
                        if (_isUploadingMedia)
                          Positioned.fill(
                            child: Container(
                              decoration: const BoxDecoration(
                                  color: Colors.black45, shape: BoxShape.circle),
                              child: const Center(
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: Colors.white),
                              ),
                            ),
                          ),
                        if (!_isUploadingMedia)
                          Positioned(
                            bottom: 4,
                            right: 4,
                            child: GestureDetector(
                              onTap: _pickFromGallery,
                              child: Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withAlpha(51),
                                      blurRadius: 6,
                                    ),
                                  ],
                                ),
                                child: const Icon(Icons.photo_library_rounded,
                                    size: 16, color: AppColors.primary),
                              ),
                            ),
                          ),
                      ],
                    ),

                    const SizedBox(height: 14),
                    Text(
                      fullName,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      email,
                      style: const TextStyle(fontSize: 14, color: Colors.white70),
                    ),
                    if (phone.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          phone,
                          style: const TextStyle(
                              fontSize: 13, color: Colors.white60),
                        ),
                      ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(51),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        widget.isAdmin ? '🔐 ADMIN' : '🐾 CUSTOMER',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // ── Settings Menu Items ──
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    // Edit Profile
                    _SettingsMenuItem(
                      icon: Icons.person_outline_rounded,
                      title: 'Edit Profile Information',
                      subtitle: 'Update your name and phone number',
                      onTap: () => _showEditProfileModal(fullName, email, phone),
                    ),
                    const SizedBox(height: 12),

                    // Biometric Login Toggle (Enable/Disable Biometric Login)
                    _BiometricToggleTile(
                      isEnabled: biometricEnabled,
                      onToggle: (val) async {
                        final messenger = ScaffoldMessenger.of(context);
                        await session.setBiometricEnabled(val);
                        if (!mounted) return;
                        setState(() {});
                        messenger.showSnackBar(SnackBar(
                          content: Text(val
                              ? 'Biometric Login enabled successfully!'
                              : 'Biometric Login disabled.'),
                          backgroundColor: val ? Colors.green : Colors.orange,
                        ));
                      },
                    ),
                    const SizedBox(height: 24),

                    // Logout Button
                    _SettingsMenuItem(
                      icon: Icons.logout_rounded,
                      title: 'Logout Account',
                      subtitle: 'Sign out from PetEy system',
                      iconColor: AppColors.error,
                      titleColor: AppColors.error,
                      onTap: () => _showLogoutDialog(context),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Biometric Toggle Tile ──
class _BiometricToggleTile extends StatelessWidget {
  final bool isEnabled;
  final ValueChanged<bool> onToggle;

  const _BiometricToggleTile({required this.isEnabled, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.deepOrange.withAlpha(26),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.fingerprint, color: Colors.deepOrange, size: 26),
            ),
            const SizedBox(width: 16),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Biometric Login',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Enable / Disable fingerprint sensor login',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
            Switch(
              value: isEnabled,
              onChanged: onToggle,
              activeThumbColor: Colors.deepOrange,
            ),
          ],
        ),
      ),
    );
  }
}

// ── Settings Menu Item ──
class _SettingsMenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;
  final Color? iconColor;
  final Color? titleColor;

  const _SettingsMenuItem({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.onTap,
    this.iconColor,
    this.titleColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: (iconColor ?? AppColors.primary).withAlpha(26),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon,
                      color: iconColor ?? AppColors.primary, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: titleColor ?? AppColors.textPrimary,
                        ),
                      ),
                      if (subtitle != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          subtitle!,
                          style: const TextStyle(
                              fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ],
                  ),
                ),
                Icon(Icons.arrow_forward_ios_rounded,
                    size: 16, color: context.textSecondary50),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
