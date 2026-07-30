import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

// ─── Model ───────────────────────────────────────────────────────────────────
class PetModel {
  final String id;
  final String name;
  final String species;
  final String breed;
  final String age;
  final String gender;
  final String status;
  final String description;
  final String? imagePath; // local picked file path or asset path

  PetModel({
    required this.id,
    required this.name,
    required this.species,
    required this.breed,
    required this.age,
    this.gender = 'Unknown',
    required this.status,
    this.description = '',
    this.imagePath,
  });

  PetModel copyWith({
    String? name,
    String? species,
    String? breed,
    String? age,
    String? gender,
    String? status,
    String? description,
    String? imagePath,
  }) {
    return PetModel(
      id: id,
      name: name ?? this.name,
      species: species ?? this.species,
      breed: breed ?? this.breed,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      status: status ?? this.status,
      description: description ?? this.description,
      imagePath: imagePath ?? this.imagePath,
    );
  }
}

// ─── Notifier ────────────────────────────────────────────────────────────────
class AdminPetsNotifier extends StateNotifier<List<PetModel>> {
  AdminPetsNotifier()
      : super([
          PetModel(
            id: 'p1',
            name: 'Jimmy',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: '2 Years',
            gender: 'Male',
            status: 'AVAILABLE',
            description: 'Friendly and energetic retriever looking for a family.',
            imagePath: 'assets/images/pet.jpg',
          ),
          PetModel(
            id: 'p2',
            name: 'Coco',
            species: 'Dog',
            breed: 'Beagle',
            age: '1.5 Years',
            gender: 'Female',
            status: 'AVAILABLE',
            description: 'Playful and curious puppy who loves outdoor adventures.',
            imagePath: 'assets/images/pet1.jpg',
          ),
          PetModel(
            id: 'p3',
            name: 'Billo Rani',
            species: 'Cat',
            breed: 'Persian',
            age: '1 Year',
            gender: 'Female',
            status: 'PENDING',
            description: 'Calm and affectionate cat ideal for apartment living.',
            imagePath: 'assets/images/pet2.jpeg',
          ),
        ]);

  void addPet(PetModel pet) => state = [pet, ...state];

  void updatePet(PetModel updated) {
    state = [
      for (final p in state)
        if (p.id == updated.id) updated else p,
    ];
  }

  void deletePet(String id) => state = state.where((p) => p.id != id).toList();

  void updateStatus(String id, String newStatus) {
    state = [
      for (final p in state)
        if (p.id == id) p.copyWith(status: newStatus) else p,
    ];
  }
}

final adminPetsProvider =
    StateNotifierProvider<AdminPetsNotifier, List<PetModel>>(
  (ref) => AdminPetsNotifier(),
);

// ─── Screen ──────────────────────────────────────────────────────────────────
class AdminPetsScreen extends ConsumerStatefulWidget {
  const AdminPetsScreen({super.key});

  @override
  ConsumerState<AdminPetsScreen> createState() => _AdminPetsScreenState();
}

class _AdminPetsScreenState extends ConsumerState<AdminPetsScreen> {
  final _picker = ImagePicker();
  String _filterStatus = 'ALL';

  static const _speciesList = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'];
  static const _statusList = ['AVAILABLE', 'PENDING', 'ADOPTED'];
  static const _genderList = ['Male', 'Female', 'Unknown'];
  static const _filterOptions = ['ALL', 'AVAILABLE', 'PENDING', 'ADOPTED'];

  Future<File?> _pickImage() async {
    final xfile =
        await _picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (xfile != null) return File(xfile.path);
    return null;
  }

  // ── Shared Pet Form Dialog (Add & Edit) ─────────────────────────────────
  void _showPetFormDialog([PetModel? existing]) {
    final isEditing = existing != null;
    final formKey = GlobalKey<FormState>();

    final nameCtrl = TextEditingController(text: existing?.name ?? '');
    final breedCtrl = TextEditingController(text: existing?.breed ?? '');
    final ageCtrl = TextEditingController(text: existing?.age ?? '');
    final descCtrl = TextEditingController(text: existing?.description ?? '');

    String selectedSpecies = existing?.species ?? 'Dog';
    String selectedGender = existing?.gender ?? 'Male';
    String selectedStatus = existing?.status ?? 'AVAILABLE';
    File? dialogImage;
    // Track whether we keep the original image or user picked a new one
    String? originalImagePath = existing?.imagePath;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            isEditing ? '✏️  Edit Pet Details' : '🐾  Add New Pet',
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontFamily: 'OutfitBold'),
          ),
          content: SizedBox(
            width: double.maxFinite,
            child: SingleChildScrollView(
              child: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // ── Image Picker ──────────────────────────────────────
                    GestureDetector(
                      onTap: () async {
                        final img = await _pickImage();
                        if (img != null) {
                          setDialogState(() {
                            dialogImage = img;
                            originalImagePath = null; // replaced
                          });
                        }
                      },
                      child: Container(
                        height: 130,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.deepOrange.shade50,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                              color: Colors.deepOrange.shade200, width: 1.5),
                        ),
                        child: dialogImage != null
                            ? Stack(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: Image.file(dialogImage!,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                        height: 130),
                                  ),
                                  Positioned(
                                    top: 8,
                                    right: 8,
                                    child: Container(
                                      padding: const EdgeInsets.all(4),
                                      decoration: const BoxDecoration(
                                          color: Colors.white,
                                          shape: BoxShape.circle),
                                      child: const Icon(Icons.edit,
                                          size: 16, color: Colors.deepOrange),
                                    ),
                                  ),
                                ],
                              )
                            : (originalImagePath != null
                                ? Stack(
                                    children: [
                                      ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(12),
                                        child: originalImagePath!
                                                .startsWith('assets/')
                                            ? Image.asset(
                                                originalImagePath!,
                                                fit: BoxFit.cover,
                                                width: double.infinity,
                                                height: 130,
                                                errorBuilder: (_, _, _) =>
                                                    _imagePlaceholder(),
                                              )
                                            : Image.file(
                                                File(originalImagePath!),
                                                fit: BoxFit.cover,
                                                width: double.infinity,
                                                height: 130),
                                      ),
                                      Positioned(
                                        top: 8,
                                        right: 8,
                                        child: Container(
                                          padding: const EdgeInsets.all(4),
                                          decoration: const BoxDecoration(
                                              color: Colors.white,
                                              shape: BoxShape.circle),
                                          child: const Icon(Icons.edit,
                                              size: 16,
                                              color: Colors.deepOrange),
                                        ),
                                      ),
                                    ],
                                  )
                                : Column(
                                    mainAxisAlignment:
                                        MainAxisAlignment.center,
                                    children: const [
                                      Icon(Icons.add_photo_alternate_outlined,
                                          size: 36, color: Colors.deepOrange),
                                      SizedBox(height: 8),
                                      Text(
                                        'Tap to upload pet photo',
                                        style: TextStyle(
                                            color: Colors.deepOrange,
                                            fontWeight: FontWeight.w500),
                                      ),
                                    ],
                                  )),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // ── Pet Name ─────────────────────────────────────────
                    TextFormField(
                      controller: nameCtrl,
                      decoration: InputDecoration(
                        labelText: 'Pet Name',
                        prefixIcon: const Icon(Icons.pets),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                      validator: (v) =>
                          v == null || v.trim().isEmpty ? 'Enter pet name' : null,
                    ),
                    const SizedBox(height: 12),

                    // ── Species Dropdown ──────────────────────────────────
                    DropdownButtonFormField<String>(
                      initialValue: selectedSpecies,
                      decoration: InputDecoration(
                        labelText: 'Species',
                        prefixIcon:
                            const Icon(Icons.category_outlined),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                      items: _speciesList
                          .map((s) =>
                              DropdownMenuItem(value: s, child: Text(s)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() => selectedSpecies = val);
                        }
                      },
                    ),
                    const SizedBox(height: 12),

                    // ── Breed ─────────────────────────────────────────────
                    TextFormField(
                      controller: breedCtrl,
                      decoration: InputDecoration(
                        labelText: 'Breed',
                        prefixIcon: const Icon(Icons.info_outline),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                      validator: (v) =>
                          v == null || v.trim().isEmpty ? 'Enter breed' : null,
                    ),
                    const SizedBox(height: 12),

                    // ── Age & Gender (side-by-side) ────────────────────────
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: ageCtrl,
                            decoration: InputDecoration(
                              labelText: 'Age',
                              hintText: 'e.g. 2 Years',
                              prefixIcon:
                                  const Icon(Icons.calendar_today_outlined),
                              border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10)),
                            ),
                            validator: (v) => v == null || v.trim().isEmpty
                                ? 'Enter age'
                                : null,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            initialValue: selectedGender,
                            decoration: InputDecoration(
                              labelText: 'Gender',
                              border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10)),
                            ),
                            items: _genderList
                                .map((g) => DropdownMenuItem(
                                    value: g, child: Text(g)))
                                .toList(),
                            onChanged: (val) {
                              if (val != null) {
                                setDialogState(() => selectedGender = val);
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // ── Status (only shown when editing) ──────────────────
                    if (isEditing) ...[
                      DropdownButtonFormField<String>(
                        initialValue: selectedStatus,
                        decoration: InputDecoration(
                          labelText: 'Adoption Status',
                          prefixIcon:
                              const Icon(Icons.toggle_on_outlined),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10)),
                        ),
                        items: _statusList
                            .map((s) => DropdownMenuItem(
                                value: s,
                                child: Row(
                                  children: [
                                    Icon(
                                      s == 'AVAILABLE'
                                          ? Icons.check_circle_outline
                                          : s == 'PENDING'
                                              ? Icons.hourglass_empty
                                              : Icons.favorite_outline,
                                      size: 16,
                                      color: s == 'AVAILABLE'
                                          ? Colors.green
                                          : s == 'PENDING'
                                              ? Colors.orange
                                              : Colors.deepPurple,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(s),
                                  ],
                                )))
                            .toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setDialogState(() => selectedStatus = val);
                          }
                        },
                      ),
                      const SizedBox(height: 12),
                    ],

                    // ── Description ───────────────────────────────────────
                    TextFormField(
                      controller: descCtrl,
                      maxLines: 2,
                      decoration: InputDecoration(
                        labelText: 'Description (optional)',
                        prefixIcon:
                            const Icon(Icons.description_outlined),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child:
                  const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                if (formKey.currentState?.validate() ?? false) {
                  final notifier = ref.read(adminPetsProvider.notifier);
                  final finalImagePath =
                      dialogImage?.path ?? originalImagePath;

                  if (isEditing) {
                    // ── UPDATE existing pet ────────────────────────────
                    final updated = existing.copyWith(
                      name: nameCtrl.text.trim(),
                      species: selectedSpecies,
                      breed: breedCtrl.text.trim(),
                      age: ageCtrl.text.trim(),
                      gender: selectedGender,
                      status: selectedStatus,
                      description: descCtrl.text.trim(),
                      imagePath: finalImagePath,
                    );
                    notifier.updatePet(updated);
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                            '${nameCtrl.text.trim()} updated successfully!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  } else {
                    // ── CREATE new pet ────────────────────────────────
                    final newPet = PetModel(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      name: nameCtrl.text.trim(),
                      species: selectedSpecies,
                      breed: breedCtrl.text.trim(),
                      age: ageCtrl.text.trim(),
                      gender: selectedGender,
                      status: 'AVAILABLE',
                      description: descCtrl.text.trim(),
                      imagePath: finalImagePath,
                    );
                    notifier.addPet(newPet);
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                            '${nameCtrl.text.trim()} added successfully!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  }
                }
              },
              child: Text(
                isEditing ? 'Save Changes' : 'Add Pet',
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Delete confirmation ───────────────────────────────────────────────────
  void _showDeleteDialog(PetModel pet) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Remove Pet?',
            style: TextStyle(fontWeight: FontWeight.bold)),
        content: Text(
            'Are you sure you want to remove "${pet.name}" from listings? This cannot be undone.'),
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
              ref.read(adminPetsProvider.notifier).deletePet(pet.id);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                    content: Text('${pet.name} removed.'),
                    backgroundColor: Colors.red),
              );
            },
            child:
                const Text('Remove', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  // ── Pet image widget ──────────────────────────────────────────────────────
  Widget _buildPetImage(PetModel pet, {double size = 70}) {
    if (pet.imagePath == null) return _imagePlaceholder(size: size);
    if (pet.imagePath!.startsWith('assets/')) {
      return Image.asset(pet.imagePath!,
          width: size, height: size, fit: BoxFit.cover,
          errorBuilder: (_, _, _) => _imagePlaceholder(size: size));
    }
    return Image.file(File(pet.imagePath!),
        width: size, height: size, fit: BoxFit.cover);
  }

  Widget _imagePlaceholder({double size = 70}) => Container(
        width: size,
        height: size,
        color: Colors.deepOrange.shade50,
        child: const Icon(Icons.pets, color: Colors.deepOrange),
      );

  // ── Status chip ───────────────────────────────────────────────────────────
  Widget _statusChip(String status) {
    Color color;
    IconData icon;
    switch (status) {
      case 'AVAILABLE':
        color = Colors.green;
        icon = Icons.check_circle_outline;
        break;
      case 'PENDING':
        color = Colors.orange;
        icon = Icons.hourglass_empty;
        break;
      case 'ADOPTED':
        color = Colors.deepPurple;
        icon = Icons.favorite_outline;
        break;
      default:
        color = Colors.grey;
        icon = Icons.help_outline;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withAlpha(25),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(status,
              style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: color)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final allPets = ref.watch(adminPetsProvider);
    final pets = _filterStatus == 'ALL'
        ? allPets
        : allPets.where((p) => p.status == _filterStatus).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showPetFormDialog(),
        backgroundColor: Colors.deepOrange,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add New Pet',
            style:
                TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header ─────────────────────────────────────────────────
            Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Manage Pets',
                          style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'OutfitBold')),
                      Text('Add, edit or remove pets for adoption',
                          style:
                              TextStyle(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.deepOrange.shade50,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${allPets.length} Total',
                    style: const TextStyle(
                        color: Colors.deepOrange,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // ── Filter Chips ───────────────────────────────────────────
            SizedBox(
              height: 36,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _filterOptions.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (_, i) {
                  final f = _filterOptions[i];
                  final isSelected = _filterStatus == f;
                  final count = f == 'ALL'
                      ? allPets.length
                      : allPets.where((p) => p.status == f).length;
                  return GestureDetector(
                    onTap: () => setState(() => _filterStatus = f),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? Colors.deepOrange
                            : Colors.deepOrange.shade50,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$f ($count)',
                        style: TextStyle(
                          color: isSelected ? Colors.white : Colors.deepOrange,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 14),

            // ── Pet List ───────────────────────────────────────────────
            Expanded(
              child: pets.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.pets,
                              size: 64, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(
                            _filterStatus == 'ALL'
                                ? 'No pets listed yet.\nTap "Add New Pet" to get started!'
                                : 'No $_filterStatus pets found.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      itemCount: pets.length,
                      separatorBuilder: (_, _) =>
                          const SizedBox(height: 10),
                      itemBuilder: (_, index) {
                        final pet = pets[index];
                        return Card(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                          elevation: 1.5,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(14),
                            onTap: () => _showPetFormDialog(pet), // tap to edit
                            child: Padding(
                              padding: const EdgeInsets.all(10),
                              child: Row(
                                children: [
                                  // Pet image
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: _buildPetImage(pet),
                                  ),
                                  const SizedBox(width: 12),

                                  // Pet info
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(pet.name,
                                            style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16)),
                                        const SizedBox(height: 2),
                                        Text(
                                            '${pet.species} • ${pet.breed}',
                                            style: const TextStyle(
                                                fontSize: 13,
                                                color: Colors.grey)),
                                        Text(
                                            'Age: ${pet.age}  •  ${pet.gender}',
                                            style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey)),
                                        const SizedBox(height: 6),
                                        _statusChip(pet.status),
                                      ],
                                    ),
                                  ),

                                  // Action buttons
                                  Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      // Edit
                                      IconButton(
                                        icon: const Icon(Icons.edit_outlined,
                                            color: Colors.blue, size: 20),
                                        tooltip: 'Edit pet',
                                        onPressed: () =>
                                            _showPetFormDialog(pet),
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(
                                            minWidth: 36, minHeight: 36),
                                      ),
                                      // Delete
                                      IconButton(
                                        icon: const Icon(
                                            Icons.delete_outline,
                                            color: Colors.red,
                                            size: 20),
                                        tooltip: 'Remove pet',
                                        onPressed: () =>
                                            _showDeleteDialog(pet),
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(
                                            minWidth: 36, minHeight: 36),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
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