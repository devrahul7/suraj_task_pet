import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/features/adoption/data/datasources/adoption_datasource.dart';
import 'package:petey_adoption_system/features/adoption/domain/entities/adoption_entity.dart';

final adoptionLocalDatasourceProvider = Provider<IAdoptionDatasource>((ref) {
  return AdoptionLocalDatasource(ref: ref);
});

class AdoptionLocalDatasource implements IAdoptionDatasource {
  final Ref ref;

  AdoptionLocalDatasource({required this.ref});

  @override
  Future<List<AdoptionEntity>> getUserAdoptions(String userEmail) async {
    final requests = ref.read(adoptionRequestProvider);
    final userReqs = userEmail.isEmpty
        ? requests
        : requests.where((r) => r.userEmail.toLowerCase() == userEmail.toLowerCase()).toList();

    return userReqs
        .map((r) => AdoptionEntity(
              id: r.id,
              userId: r.userId,
              userName: r.userName,
              userEmail: r.userEmail,
              petId: r.petId,
              petName: r.petName,
              breed: r.breed,
              species: r.species,
              image: r.image,
              fee: r.fee,
              status: r.status,
              requestDate: r.requestDate,
              visitDate: r.visitDate,
              visitType: r.visitType,
              adminNotes: r.adminNotes,
            ))
        .toList();
  }

  @override
  Future<bool> createAdoptionRequest(AdoptionEntity entity) async {
    try {
      ref.read(adoptionRequestProvider.notifier).addRequest(
            userName: entity.userName,
            userEmail: entity.userEmail,
            petName: entity.petName,
            breed: entity.breed,
            species: entity.species,
            petImage: entity.image,
            visitDate: entity.visitDate,
            visitType: entity.visitType,
          );
      return true;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<bool> updateAdoptionStatus(String id, String status, String note) async {
    try {
      if (status == 'APPROVED') {
        ref.read(adoptionRequestProvider.notifier).approveRequest(id);
      } else if (status == 'REJECTED') {
        ref.read(adoptionRequestProvider.notifier).rejectRequest(id);
      } else if (status == 'PAID') {
        ref.read(adoptionRequestProvider.notifier).markAsPaid(id);
      }
      return true;
    } catch (_) {
      return false;
    }
  }
}
