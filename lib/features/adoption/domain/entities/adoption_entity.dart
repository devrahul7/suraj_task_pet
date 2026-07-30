import 'package:equatable/equatable.dart';

class AdoptionEntity extends Equatable {
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

  const AdoptionEntity({
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

  @override
  List<Object?> get props => [
        id,
        userId,
        userName,
        userEmail,
        petId,
        petName,
        breed,
        species,
        image,
        fee,
        status,
        requestDate,
        visitDate,
        visitType,
        adminNotes,
      ];
}
