import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:petey_adoption_system/core/constants/app_constants.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';

/// Real Stripe Checkout page.
///
/// Uses flutter_stripe's [PaymentSheet] — the official Stripe-hosted UI.
/// Flow:
///   1. [_createPaymentIntent] — creates real PaymentIntent via Stripe API.
///   2. [Stripe.instance.initPaymentSheet] — loads the payment sheet.
///   3. [Stripe.instance.presentPaymentSheet] — shows the native Stripe UI.
///   4. On success → marks adoption PAID & pet ADOPTED in Riverpod state.
class AdoptionPaymentPage extends ConsumerStatefulWidget {
  final String adoptionId;
  final String petName;
  final double feeAmount;

  const AdoptionPaymentPage({
    super.key,
    required this.adoptionId,
    required this.petName,
    required this.feeAmount,
  });

  @override
  ConsumerState<AdoptionPaymentPage> createState() =>
      _AdoptionPaymentPageState();
}

class _AdoptionPaymentPageState extends ConsumerState<AdoptionPaymentPage> {
  bool _isLoading = false;
  bool _paymentSuccess = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _setupStripe();
  }

  /// Configure the Stripe publishable key once.
  void _setupStripe() {
    Stripe.publishableKey = AppConstants.stripePublishableKey;
  }

  /// Step 1 — obtain a PaymentIntent client_secret directly from Stripe REST API.
  Future<String> _createPaymentIntent() async {
    final dio = Dio();
    final response = await dio.post(
      'https://api.stripe.com/v1/payment_intents',
      data: {
        'amount': (widget.feeAmount * 100).toInt().toString(), // in cents
        'currency': 'usd',
        'payment_method_types[]': 'card',
        'description': 'PetEy Adoption Fee for ${widget.petName}',
      },
      options: Options(
        contentType: Headers.formUrlEncodedContentType,
        headers: {
          'Authorization': 'Bearer ${AppConstants.stripeSecretKey}',
        },
      ),
    );

    final clientSecret = response.data['client_secret'];
    if (clientSecret == null) {
      throw Exception('Stripe API failed to return client_secret');
    }
    return clientSecret as String;
  }

  /// Steps 2 & 3 — initialise and present the native Stripe PaymentSheet.
  Future<void> _openStripeCheckout() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Step 1: Get PaymentIntent client_secret from backend
      final clientSecret = await _createPaymentIntent();

      // Step 2: Initialise PaymentSheet
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'PetEy Adoption',
          style: ThemeMode.light,
          appearance: const PaymentSheetAppearance(
            colors: PaymentSheetAppearanceColors(
              primary: Color(0xFFFF5722), // deep orange
            ),
          ),
        ),
      );

      // Step 3: Present the native Stripe payment sheet
      await Stripe.instance.presentPaymentSheet();

      // ✅ Payment successful — update app state
      if (mounted) {
        ref
            .read(adoptionRequestProvider.notifier)
            .markAsPaid(widget.adoptionId);
        setState(() {
          _isLoading = false;
          _paymentSuccess = true;
        });
      }
    } on StripeException catch (e) {
      // User cancelled or card declined
      if (mounted) {
        final msg = e.error.localizedMessage ?? e.error.message ?? 'Payment cancelled.';
        setState(() {
          _isLoading = false;
          _errorMessage = msg;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _errorMessage =
              'Payment failed: ${e.toString()}. Make sure you have a real Stripe backend connected.';
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
          'Stripe Checkout',
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
      body: _paymentSuccess ? _buildSuccessView() : _buildCheckoutView(),
    );
  }

  Widget _buildCheckoutView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Order Summary Card ──────────────────────────────────────
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.deepOrange.shade50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.deepOrange.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.deepOrange.shade100,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.pets,
                          color: Colors.deepOrange, size: 28),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Adopting ${widget.petName}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'One-time Adoption Fee',
                            style: TextStyle(
                                fontSize: 13, color: Colors.deepOrange),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Adoption Fee',
                        style: TextStyle(fontSize: 15)),
                    Text(
                      '\$${widget.feeAmount.toStringAsFixed(2)}',
                      style: const TextStyle(
                          fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text('Processing Fee',
                        style: TextStyle(fontSize: 14, color: Colors.grey)),
                    Text('\$0.00',
                        style:
                            TextStyle(fontSize: 14, color: Colors.grey)),
                  ],
                ),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total',
                      style: TextStyle(
                          fontSize: 17, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '\$${widget.feeAmount.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.deepOrange,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // ── Stripe Trust Badge ──────────────────────────────────────
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Row(
              children: [
                const Icon(Icons.lock, color: Colors.green, size: 22),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Secured by Stripe',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        'Your payment info is encrypted with SSL/TLS and never stored on our servers.',
                        style:
                            TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // ── Error message ───────────────────────────────────────────
          if (_errorMessage != null) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.red.shade300),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: Colors.red),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _errorMessage!,
                      style: TextStyle(
                          color: Colors.red.shade800, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // ── Pay Button ──────────────────────────────────────────────
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                elevation: 2,
              ),
              onPressed: _isLoading ? null : _openStripeCheckout,
              icon: _isLoading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2.5,
                      ),
                    )
                  : const Icon(Icons.payment, color: Colors.white),
              label: Text(
                _isLoading
                    ? 'Opening Stripe...'
                    : 'Pay \$${widget.feeAmount.toStringAsFixed(2)} with Stripe',
                style: const TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),
          Center(
            child: Text(
              'Powered by Stripe Payment Sheet SDK',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle,
                color: Colors.green,
                size: 90,
              ),
            ),
            const SizedBox(height: 28),
            const Text(
              'Payment Successful! 🎉',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              'Congratulations! You have officially adopted ${widget.petName}.\n\nThe pet status has been updated to ADOPTED and notifications have been sent.',
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: Colors.grey.shade700, fontSize: 15, height: 1.5),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.deepOrange.shade50,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.deepOrange.shade200),
              ),
              child: Text(
                'Amount paid: \$${widget.feeAmount.toStringAsFixed(2)}',
                style: const TextStyle(
                  color: Colors.deepOrange,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(height: 36),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                padding: const EdgeInsets.symmetric(
                    horizontal: 40, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text(
                'Back to My Pets',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
