import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';

class BookPetPage extends ConsumerStatefulWidget {
  final String petName;
  final String petBreed;

  const BookPetPage({
    super.key,
    this.petName = 'Golden Buddy',
    this.petBreed = 'Golden Retriever',
  });

  @override
  ConsumerState<BookPetPage> createState() => _BookPetPageState();
}

class _BookPetPageState extends ConsumerState<BookPetPage> {
  final _formKey = GlobalKey<FormState>();
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  String _selectedTimeSlot = '10:00 AM - 11:30 AM';
  String _visitType = 'Shelter Visit';
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _noteController = TextEditingController();
  bool _isBooking = false;
  bool _bookingSuccess = false;

  final List<String> _timeSlots = [
    '09:00 AM - 10:30 AM',
    '10:30 AM - 12:00 PM',
    '01:30 PM - 03:00 PM',
    '03:30 PM - 05:00 PM',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _confirmBooking() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() => _isBooking = true);
      await Future.delayed(const Duration(milliseconds: 500));

      final session = ref.read(userSessionServiceProvider);
      final userName = session.getUserFullName() ?? _nameController.text.trim();
      final userEmail = session.getUserEmail() ?? 'user@petey.com';

      ref.read(adoptionRequestProvider.notifier).addRequest(
            userName: userName,
            userEmail: userEmail,
            petName: widget.petName,
            breed: widget.petBreed,
            species: 'Dog',
            visitDate:
                '${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}',
            visitType: _visitType,
          );

      if (mounted) {
        setState(() {
          _isBooking = false;
          _bookingSuccess = true;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Book Pet Meet & Greet',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontFamily: 'OutfitBold',
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: _bookingSuccess ? _buildSuccessView() : _buildForm(),
      ),
    );
  }

  Widget _buildForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.deepOrange.shade50,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.deepOrange.shade200),
            ),
            child: Row(
              children: [
                const Icon(Icons.pets, color: Colors.deepOrange, size: 36),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Booking Visit for ${widget.petName}',
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Breed: ${widget.petBreed}',
                        style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Select Visit Type',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: ChoiceChip(
                  label: const Text('Shelter Visit'),
                  selected: _visitType == 'Shelter Visit',
                  selectedColor: Colors.deepOrange.shade100,
                  onSelected: (val) => setState(() => _visitType = 'Shelter Visit'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ChoiceChip(
                  label: const Text('Home Meet & Greet'),
                  selected: _visitType == 'Home Meet & Greet',
                  selectedColor: Colors.deepOrange.shade100,
                  onSelected: (val) =>
                      setState(() => _visitType = 'Home Meet & Greet'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Text(
            'Visit Date & Time Slot',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          ListTile(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: Colors.grey.shade300),
            ),
            leading: const Icon(Icons.calendar_today, color: Colors.deepOrange),
            title: Text(
              'Date: ${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            trailing: const Icon(Icons.edit_calendar),
            onTap: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 30)),
              );
              if (picked != null) {
                setState(() => _selectedDate = picked);
              }
            },
          ),
          const SizedBox(height: 14),
          DropdownButtonFormField<String>(
            initialValue: _selectedTimeSlot,
            decoration: InputDecoration(
              labelText: 'Preferred Time Slot',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            items: _timeSlots
                .map((slot) => DropdownMenuItem(value: slot, child: Text(slot)))
                .toList(),
            onChanged: (val) => setState(() => _selectedTimeSlot = val!),
          ),
          const SizedBox(height: 20),
          const Text(
            'Contact Details',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          TextFormField(
            controller: _nameController,
            decoration: InputDecoration(
              labelText: 'Your Full Name',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            validator: (val) =>
                val == null || val.trim().isEmpty ? 'Enter your name' : null,
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              labelText: 'Phone Number',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            validator: (val) =>
                val == null || val.trim().isEmpty ? 'Enter phone number' : null,
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _noteController,
            maxLines: 2,
            decoration: InputDecoration(
              labelText: 'Special Notes / Questions for Shelter',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 28),
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: _isBooking ? null : _confirmBooking,
              child: _isBooking
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text(
                      'Confirm Pet Booking',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.event_available, color: Colors.green, size: 80),
          ),
          const SizedBox(height: 24),
          Text(
            'Booking Confirmed for ${widget.petName}!',
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Text(
            'Your meet & greet is scheduled for:\n${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')} during $_selectedTimeSlot.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey.shade700, fontSize: 14),
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.deepOrange,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Back to Dashboard',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
