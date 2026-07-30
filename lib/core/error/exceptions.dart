// Custom exceptions for PetEy.
//
// Exceptions are thrown by the data layer (datasources / repositories)
// and caught to produce Failure objects for the domain/presentation layers.

/// Thrown when a local Hive database operation fails.
class LocalDatabaseException implements Exception {
  final String message;
  const LocalDatabaseException({this.message = 'Local database error occurred.'});

  @override
  String toString() => 'LocalDatabaseException: $message';
}

/// Thrown when an HTTP / remote API call fails.
class ApiException implements Exception {
  final int? statusCode;
  final String message;

  const ApiException({this.statusCode, required this.message});

  @override
  String toString() => 'ApiException(${statusCode ?? 'N/A'}): $message';
}

/// Thrown when a user with the given email or username already exists.
class UserAlreadyExistsException implements Exception {
  final String message;
  const UserAlreadyExistsException({this.message = 'User already exists.'});

  @override
  String toString() => 'UserAlreadyExistsException: $message';
}

/// Thrown when login credentials do not match any record.
class InvalidCredentialsException implements Exception {
  final String message;
  const InvalidCredentialsException({this.message = 'Invalid email or password.'});

  @override
  String toString() => 'InvalidCredentialsException: $message';
}

/// Thrown when a requested entity (pet, adoption request, etc.) is not found.
class NotFoundException implements Exception {
  final String message;
  const NotFoundException({this.message = 'Resource not found.'});

  @override
  String toString() => 'NotFoundException: $message';
}

/// Thrown when the device has no active internet connection.
class NetworkException implements Exception {
  final String message;
  const NetworkException({this.message = 'No internet connection.'});

  @override
  String toString() => 'NetworkException: $message';
}

/// Thrown when a payment / Stripe operation fails.
class PaymentException implements Exception {
  final String message;
  const PaymentException({this.message = 'Payment failed. Please try again.'});

  @override
  String toString() => 'PaymentException: $message';
}
