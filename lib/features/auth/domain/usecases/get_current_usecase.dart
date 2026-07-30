import 'package:equatable/equatable.dart';

class GetCurrentUsecase extends Equatable {
  final String? authId;
  const GetCurrentUsecase({this.authId});

  @override
  List<Object?> get props => [authId];
}