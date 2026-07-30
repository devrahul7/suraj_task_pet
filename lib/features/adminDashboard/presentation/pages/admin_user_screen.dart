import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/api/api_client.dart';

class UserModel {
  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String role; // 'USER' or 'ADMIN'
  final bool isActive;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.role,
    this.isActive = true,
    required this.createdAt,
  });

  UserModel copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? role,
    bool? isActive,
  }) {
    return UserModel(
      id: id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt,
    );
  }
}

class AdminUsersNotifier extends StateNotifier<List<UserModel>> {
  final Ref _ref;

  AdminUsersNotifier(this._ref, {bool autoFetch = true}) : super([]) {
    if (autoFetch) {
      _fetchUsersFromApi();
    }
  }

  Future<void> _fetchUsersFromApi() async {
    try {
      final apiClient = _ref.read(apiClientProvider);
      final response = await apiClient.get('/users');
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data;
        List<dynamic> usersJson = [];
        if (data is Map<String, dynamic>) {
          if (data['data'] is List) {
            usersJson = data['data'];
          } else if (data['data'] is Map && data['data']['users'] is List) {
            usersJson = data['data']['users'];
          } else if (data['users'] is List) {
            usersJson = data['users'];
          }
        } else if (data is List) {
          usersJson = data;
        }

        final remoteUsers = usersJson.map((json) {
          final roleStr = (json['role'] ?? 'USER').toString().toUpperCase();
          return UserModel(
            id: json['_id'] ?? json['id'] ?? 'u_${DateTime.now().millisecondsSinceEpoch}',
            fullName: json['fullName'] ?? json['name'] ?? 'User',
            email: json['email'] ?? 'user@petey.com',
            phone: json['phone'] ?? json['phoneNumber'] ?? 'N/A',
            role: roleStr,
            isActive: json['isActive'] ?? true,
            createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
          );
        }).toList();

        // Always preserve master admin account
        final masterAdmin = UserModel(
          id: 'u3',
          fullName: 'Admin User',
          email: 'admin@petey.com',
          phone: '9800000000',
          role: 'ADMIN',
          createdAt: DateTime.now().subtract(const Duration(days: 30)),
        );

        final hasAdmin = remoteUsers.any((u) => u.email.toLowerCase() == 'admin@petey.com' || u.role == 'ADMIN');
        if (!hasAdmin) {
          remoteUsers.add(masterAdmin);
        }

        state = remoteUsers;
      }
    } catch (_) {
      // Backend offline -> keep initial state fallback
    }
  }

  void addUser(UserModel user) => state = [user, ...state];

  void updateUser(UserModel updated) {
    state = [
      for (final u in state)
        if (u.id == updated.id) updated else u
    ];
  }

  void deleteUser(String id) {
    // Prevent deletion of ADMIN accounts
    final user = state.firstWhere((u) => u.id == id, orElse: () => state.first);
    if (user.role == 'ADMIN') return; // guard: admin cannot be deleted
    state = state.where((u) => u.id != id).toList();
  }

  void toggleStatus(String id) {
    state = [
      for (final u in state)
        if (u.id == id) u.copyWith(isActive: !u.isActive) else u
    ];
  }
}

final adminUsersProvider =
    StateNotifierProvider<AdminUsersNotifier, List<UserModel>>(
  (ref) => AdminUsersNotifier(ref),
);

class AdminUsersScreen extends ConsumerStatefulWidget {
  const AdminUsersScreen({super.key});

  @override
  ConsumerState<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends ConsumerState<AdminUsersScreen> {
  final _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _showUserFormDialog([UserModel? existingUser]) {
    final isEditing = existingUser != null;
    final formKey = GlobalKey<FormState>();
    final nameCtrl = TextEditingController(text: existingUser?.fullName ?? '');
    final emailCtrl = TextEditingController(text: existingUser?.email ?? '');
    final phoneCtrl = TextEditingController(text: existingUser?.phone ?? '');
    String selectedRole = existingUser?.role ?? 'USER';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            isEditing ? 'Edit User Details' : 'Add New User',
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontFamily: 'OutfitBold'),
          ),
          content: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: nameCtrl,
                    decoration: InputDecoration(
                      labelText: 'Full Name',
                      prefixIcon: const Icon(Icons.person_outline),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10)),
                    ),
                    validator: (v) =>
                        v == null || v.trim().isEmpty ? 'Enter full name' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      labelText: 'Email Address',
                      prefixIcon: const Icon(Icons.email_outlined),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10)),
                    ),
                    validator: (v) {
                      if (v == null || v.trim().isEmpty) return 'Enter email';
                      if (!v.contains('@')) return 'Enter valid email';
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: phoneCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: 'Phone Number',
                      prefixIcon: const Icon(Icons.phone_outlined),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10)),
                    ),
                    validator: (v) =>
                        v == null || v.trim().isEmpty ? 'Enter phone number' : null,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    initialValue: selectedRole,
                    decoration: InputDecoration(
                      labelText: 'System Role',
                      prefixIcon: const Icon(Icons.admin_panel_settings_outlined),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10)),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'USER', child: Text('User')),
                      DropdownMenuItem(value: 'ADMIN', child: Text('Admin')),
                    ],
                    onChanged: (val) {
                      if (val != null) setDialogState(() => selectedRole = val);
                    },
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                if (formKey.currentState?.validate() ?? false) {
                  final notifier = ref.read(adminUsersProvider.notifier);
                  if (isEditing) {
                    final updated = existingUser.copyWith(
                      fullName: nameCtrl.text.trim(),
                      email: emailCtrl.text.trim(),
                      phone: phoneCtrl.text.trim(),
                      role: selectedRole,
                    );
                    notifier.updateUser(updated);
                  } else {
                    final newUser = UserModel(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      fullName: nameCtrl.text.trim(),
                      email: emailCtrl.text.trim(),
                      phone: phoneCtrl.text.trim(),
                      role: selectedRole,
                      createdAt: DateTime.now(),
                    );
                    notifier.addUser(newUser);
                  }
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(isEditing
                          ? 'User updated successfully!'
                          : 'User created successfully!'),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              },
              child: Text(
                isEditing ? 'Save Changes' : 'Create User',
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteConfirmDialog(UserModel user) {
    // Admin accounts cannot be deleted
    if (user.role == 'ADMIN') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Row(
            children: [
              Icon(Icons.shield, color: Colors.white),
              SizedBox(width: 8),
              Text('Admin accounts cannot be deleted.'),
            ],
          ),
          backgroundColor: Colors.deepOrange,
          duration: Duration(seconds: 3),
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete User Account',
            style: TextStyle(fontWeight: FontWeight.bold)),
        content: Text(
            'Are you sure you want to delete "${user.fullName}" (${user.email})? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              ref.read(adminUsersProvider.notifier).deleteUser(user.id);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${user.fullName} deleted.'),
                  backgroundColor: Colors.red,
                ),
              );
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final allUsers = ref.watch(adminUsersProvider);
    final filteredUsers = allUsers.where((u) {
      final q = _searchQuery.toLowerCase();
      return u.fullName.toLowerCase().contains(q) ||
          u.email.toLowerCase().contains(q) ||
          u.phone.contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showUserFormDialog(),
        backgroundColor: Colors.deepOrange,
        icon: const Icon(Icons.person_add, color: Colors.white),
        label: const Text(
          'Add User',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'User Management',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'OutfitBold',
                        ),
                      ),
                      Text(
                        'View, add, edit, or deactivate system users',
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.deepOrange.shade50,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${allUsers.length} Total Users',
                    style: const TextStyle(
                      color: Colors.deepOrange,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Search Bar
            TextField(
              controller: _searchCtrl,
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search users by name, email, or phone...',
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchCtrl.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
              ),
            ),
            const SizedBox(height: 16),

            Expanded(
              child: filteredUsers.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.people_outline,
                              size: 64, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(
                            _searchQuery.isEmpty
                                ? 'No registered users found.'
                                : 'No users match "$_searchQuery"',
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      itemCount: filteredUsers.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final user = filteredUsers[index];
                        final isAdminRole = user.role == 'ADMIN';

                        return Card(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                          elevation: 1.5,
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 24,
                                  backgroundColor: isAdminRole
                                      ? Colors.deepOrange.shade100
                                      : Colors.blue.shade50,
                                  child: Icon(
                                    isAdminRole
                                        ? Icons.admin_panel_settings
                                        : Icons.person,
                                    color: isAdminRole
                                        ? Colors.deepOrange
                                        : Colors.blue,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              user.fullName,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 15,
                                              ),
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: isAdminRole
                                                  ? Colors.deepOrange.shade50
                                                  : Colors.blue.shade50,
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              user.role,
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: isAdminRole
                                                    ? Colors.deepOrange
                                                    : Colors.blue,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        user.email,
                                        style: TextStyle(
                                            fontSize: 13,
                                            color: Colors.grey.shade700),
                                      ),
                                      if (user.phone.isNotEmpty)
                                        Text(
                                          'Phone: ${user.phone}',
                                          style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey.shade500),
                                        ),
                                    ],
                                  ),
                                ),
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit_outlined,
                                          color: Colors.blue, size: 20),
                                      onPressed: () =>
                                          _showUserFormDialog(user),
                                      tooltip: 'Edit user',
                                    ),
                                    // Admin accounts cannot be deleted — show lock icon instead
                                    if (isAdminRole)
                                      Tooltip(
                                        message: 'Admin accounts are protected and cannot be deleted',
                                        child: Container(
                                          width: 36,
                                          height: 36,
                                          margin: const EdgeInsets.all(4),
                                          decoration: BoxDecoration(
                                            color: Colors.deepOrange.shade50,
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(
                                            Icons.shield,
                                            color: Colors.deepOrange,
                                            size: 18,
                                          ),
                                        ),
                                      )
                                    else
                                      IconButton(
                                        icon: const Icon(Icons.delete_outline,
                                            color: Colors.red, size: 20),
                                        onPressed: () =>
                                            _showDeleteConfirmDialog(user),
                                        tooltip: 'Delete user',
                                      ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}