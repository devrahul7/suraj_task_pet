import 'package:petey_adoption_system/features/adoption/domain/entities/adoption_entity.dart';

abstract class IAdoptionDatasource {
  Future<List<AdoptionEntity>> getUserAdoptions(String userEmail);
  Future<bool> createAdoptionRequest(AdoptionEntity entity);
  Future<bool> updateAdoptionStatus(String id, String status, String note);
}
