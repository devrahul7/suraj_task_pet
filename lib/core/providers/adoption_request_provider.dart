import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/api/api_client.dart';
import 'package:petey_adoption_system/core/api/api_endpoints.dart';
import 'package:petey_adoption_system/core/providers/notification_provider.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';

class AdoptionRequestModel {
  final String id;
  final String userId;
  final String userName;
  final String userEmail;
  final String petId;
  final String petName;
  final String breed;
  final String species;
  final String image;
  final double fee;
  final String status; // 'PENDING', 'APPROVED', 'REJECTED', 'PAID'
  final String requestDate;
  final String? visitDate;
  final String? visitType;
  final String adminNotes;

  AdoptionRequestModel({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userEmail,
    required this.petId,
    required this.petName,
    required this.breed,
    required this.species,
    required this.image,
    this.fee = 150.0,
    required this.status,
    required this.requestDate,
    this.visitDate,
    this.visitType,
    required this.adminNotes,
  });

  AdoptionRequestModel copyWith({
    String? status,
    String? adminNotes,
  }) {
    return AdoptionRequestModel(
      id: id,
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      petId: petId,
      petName: petName,
      breed: breed,
      species: species,
      image: image,
      fee: fee,
      status: status ?? this.status,
      requestDate: requestDate,
      visitDate: visitDate,
      visitType: visitType,
      adminNotes: adminNotes ?? this.adminNotes,
    );
  }
}

class AdoptionRequestNotifier extends StateNotifier<List<AdoptionRequestModel>> {
  final Ref ref;

  AdoptionRequestNotifier(this.ref, {bool autoFetch = true}) : super([]) {
    if (autoFetch) {
      _fetchRequestsFromApi();
    }
  }

  Future<void> _fetchRequestsFromApi() async {
    try {
      final apiClient = ref.read(apiClientProvider);
      final response = await apiClient.get(ApiEndpoints.adoptionRequests);
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data;
        List<dynamic> reqsJson = [];
        if (data is Map<String, dynamic>) {
          if (data['data'] is List) {
            reqsJson = data['data'];
          } else if (data['requests'] is List) {
            reqsJson = data['requests'];
          }
        } else if (data is List) {
          reqsJson = data;
        }

        final remoteReqs = reqsJson.map((json) {
          return AdoptionRequestModel(
            id: json['_id'] ?? json['id'] ?? 'req_${DateTime.now().millisecondsSinceEpoch}',
            userId: json['userId'] ?? json['user'] ?? 'user',
            userName: json['userName'] ?? json['userFullName'] ?? 'Customer',
            userEmail: json['userEmail'] ?? json['email'] ?? 'user@petey.com',
            petId: json['petId'] ?? json['pet'] ?? 'pet',
            petName: json['petName'] ?? 'Pet',
            breed: json['breed'] ?? 'Mixed',
            species: json['species'] ?? 'Dog',
            image: json['image'] ?? 'assets/images/pet.jpg',
            fee: (json['fee'] as num?)?.toDouble() ?? 150.0,
            status: (json['status'] ?? 'PENDING').toString().toUpperCase(),
            requestDate: json['requestDate'] ?? json['createdAt']?.toString().split('T')[0] ?? '2026-07-30',
            visitDate: json['visitDate'],
            visitType: json['visitType'],
            adminNotes: json['adminNotes'] ?? 'Request under review',
          );
        }).toList();

        // Update state to match backend database (empty if MongoDB cleared)
        state = remoteReqs;
      }
    } catch (_) {
      // Backend offline -> keep fallback
    }
  }

  /// Customer submits booking/adoption request
  void addRequest({
    required String userName,
    required String userEmail,
    required String petName,
    required String breed,
    required String species,
    String? petImage,
    String? visitDate,
    String? visitType,
  }) {
    final newId = 'req_${DateTime.now().millisecondsSinceEpoch}';
    final newRequest = AdoptionRequestModel(
      id: newId,
      userId: userEmail,
      userName: userName.isEmpty ? 'Customer' : userName,
      userEmail: userEmail.isEmpty ? 'user@petey.com' : userEmail,
      petId: 'p_${DateTime.now().millisecondsSinceEpoch}',
      petName: petName,
      breed: breed,
      species: species,
      image: petImage ?? 'assets/images/pet.jpg',
      fee: 150.0,
      status: 'PENDING',
      requestDate: DateTime.now().toString().split(' ')[0],
      visitDate: visitDate,
      visitType: visitType,
      adminNotes: 'Waiting for Admin confirmation...',
    );

    state = [newRequest, ...state];

    // Notify Admin of new request
    ref.read(adminNotificationProvider.notifier).addNotification(
          AppNotification(
            id: 'an_${DateTime.now().millisecondsSinceEpoch}',
            title: 'New Adoption Booking',
            body: '$userName submitted an adoption request for $petName ($breed).',
            time: DateTime.now(),
            type: 'adoption',
          ),
        );
  }

  /// Admin approves request -> Enables Stripe payment button for Customer
  void approveRequest(String id) {
    state = [
      for (final req in state)
        if (req.id == id)
          req.copyWith(
            status: 'APPROVED',
            adminNotes:
                'Request approved by Admin! Please complete fee payment to finalize adoption.',
          )
        else
          req
    ];

    final target = state.firstWhere((r) => r.id == id, orElse: () => state.first);

    // Notify Customer that request is approved and pay button enabled
    ref.read(notificationProvider.notifier).addNotification(
          AppNotification(
            id: 'un_${DateTime.now().millisecondsSinceEpoch}',
            title: 'Adoption Request Approved! 🎉',
            body:
                'Your request for ${target.petName} was approved by Admin. Please proceed to payment.',
            time: DateTime.now(),
            type: 'adoption',
          ),
        );
  }

  /// Admin rejects request
  void rejectRequest(String id) {
    state = [
      for (final req in state)
        if (req.id == id)
          req.copyWith(
            status: 'REJECTED',
            adminNotes: 'Adoption request was declined by Admin.',
          )
        else
          req
    ];

    final target = state.firstWhere((r) => r.id == id, orElse: () => state.first);

    // Notify Customer of rejection
    ref.read(notificationProvider.notifier).addNotification(
          AppNotification(
            id: 'un_${DateTime.now().millisecondsSinceEpoch}',
            title: 'Adoption Request Update',
            body: 'Your adoption request for ${target.petName} was declined by Admin.',
            time: DateTime.now(),
            type: 'adoption',
          ),
        );
  }

  /// Customer completes Stripe payment -> Marks pet as adopted in system
  void markAsPaid(String id) {
    state = [
      for (final req in state)
        if (req.id == id)
          req.copyWith(
            status: 'PAID',
            adminNotes: 'Payment verified via Stripe! Pet officially adopted.',
          )
        else
          req
    ];

    final target = state.firstWhere((r) => r.id == id, orElse: () => state.first);

    // Update pet status to ADOPTED in AdminPetsNotifier
    final pets = ref.read(adminPetsProvider);
    final pet = pets.firstWhere(
      (p) => p.name.toLowerCase() == target.petName.toLowerCase(),
      orElse: () => pets.first,
    );
    ref.read(adminPetsProvider.notifier).updateStatus(pet.id, 'ADOPTED');

    // Notify Customer
    ref.read(notificationProvider.notifier).addNotification(
          AppNotification(
            id: 'un_${DateTime.now().millisecondsSinceEpoch}',
            title: 'Adoption Finalized! 🐶❤️',
            body:
                'Payment of \$${target.fee.toStringAsFixed(0)} received for ${target.petName}. Congratulations on your new pet!',
            time: DateTime.now(),
            type: 'adoption',
          ),
        );

    // Notify Admin
    ref.read(adminNotificationProvider.notifier).addNotification(
          AppNotification(
            id: 'an_${DateTime.now().millisecondsSinceEpoch}',
            title: 'Adoption Payment Received 💰',
            body:
                '${target.userName} completed Stripe payment for ${target.petName}. Pet status updated to ADOPTED.',
            time: DateTime.now(),
            type: 'adoption',
          ),
        );
  }
}

final adoptionRequestProvider =
    StateNotifierProvider<AdoptionRequestNotifier, List<AdoptionRequestModel>>(
  (ref) => AdoptionRequestNotifier(ref),
);
