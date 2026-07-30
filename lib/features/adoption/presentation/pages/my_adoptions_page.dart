import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/adoption/presentation/pages/adoption_payment_page.dart';

class MyAdoptionsPage extends ConsumerStatefulWidget {
  const MyAdoptionsPage({super.key});

  @override
  ConsumerState<MyAdoptionsPage> createState() => _MyAdoptionsPageState();
}

class _MyAdoptionsPageState extends ConsumerState<MyAdoptionsPage> {
  String _selectedFilter = 'ALL';

  @override
  Widget build(BuildContext context) {
    final session = ref.watch(userSessionServiceProvider);
    final userEmail = (session.getUserEmail() ?? '').toLowerCase();

    final allRequests = ref.watch(adoptionRequestProvider);

    // Filter requests relevant to current user (or show all if user email not set)
    final userRequests = userEmail.isEmpty
        ? allRequests
        : allRequests.where((r) => r.userEmail.toLowerCase() == userEmail || r.userId == 'u1').toList();

    final filtered = _selectedFilter == 'ALL'
        ? userRequests
        : userRequests.where((r) => r.status == _selectedFilter).toList();

    final pendingCount = userRequests.where((r) => r.status == 'PENDING').length;
    final approvedCount = userRequests.where((r) => r.status == 'APPROVED').length;
    final paidCount = userRequests.where((r) => r.status == 'PAID').length;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'My Pets',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.black,
            fontFamily: 'OutfitBold',
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'My Pets & Adoption Requests',
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'OutfitBold'),
            ),
            const SizedBox(height: 4),
            Text(
              'Track booking status, admin approval, and complete Stripe payment once approved.',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
            const SizedBox(height: 16),

            // Filter Chips
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _filterChip('ALL', 'All (${userRequests.length})'),
                  const SizedBox(width: 8),
                  _filterChip('PENDING', 'Waiting Approval ($pendingCount)'),
                  const SizedBox(width: 8),
                  _filterChip('APPROVED', 'Pay Fee Enabled ($approvedCount)'),
                  const SizedBox(width: 8),
                  _filterChip('PAID', 'Adopted ($paidCount)'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.pets_outlined,
                              size: 64, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(
                            _selectedFilter == 'ALL'
                                ? 'No pet adoption requests yet.\nExplore pets and submit a request!'
                                : 'No $_selectedFilter adoption requests.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      itemCount: filtered.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 14),
                      itemBuilder: (context, index) {
                        final req = filtered[index];
                        return _buildPetCard(req);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _filterChip(String key, String label) {
    final isSelected = _selectedFilter == key;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? Colors.white : Colors.black87,
        ),
      ),
      selected: isSelected,
      selectedColor: Colors.deepOrange,
      backgroundColor: Colors.grey.shade100,
      onSelected: (val) {
        if (val) setState(() => _selectedFilter = key);
      },
    );
  }

  Widget _buildPetCard(AdoptionRequestModel req) {
    final isPending = req.status == 'PENDING';
    final isApproved = req.status == 'APPROVED';
    final isPaid = req.status == 'PAID';
    final isRejected = req.status == 'REJECTED';

    Color badgeColor;
    Color badgeBorder;
    Color badgeTextColor;
    String statusLabel;
    IconData statusIcon;

    if (isPaid) {
      badgeColor = Colors.green.shade50;
      badgeBorder = Colors.green;
      badgeTextColor = Colors.green.shade900;
      statusLabel = 'OFFICIALLY ADOPTED 🎉';
      statusIcon = Icons.verified;
    } else if (isApproved) {
      badgeColor = Colors.deepOrange.shade50;
      badgeBorder = Colors.deepOrange;
      badgeTextColor = Colors.deepOrange.shade900;
      statusLabel = 'APPROVED - PAY FEE TO ADOPT';
      statusIcon = Icons.payment;
    } else if (isRejected) {
      badgeColor = Colors.red.shade50;
      badgeBorder = Colors.red;
      badgeTextColor = Colors.red;
      statusLabel = 'DECLINED BY ADMIN';
      statusIcon = Icons.cancel_outlined;
    } else {
      badgeColor = Colors.amber.shade50;
      badgeBorder = Colors.amber;
      badgeTextColor = Colors.amber.shade900;
      statusLabel = 'WAITING ADMIN APPROVAL';
      statusIcon = Icons.hourglass_empty;
    }

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: _buildPetImage(req.image),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        req.petName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${req.breed} (${req.species})',
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Request Date: ${req.requestDate}',
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Status Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: badgeColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: badgeBorder),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(statusIcon, size: 14, color: badgeTextColor),
                  const SizedBox(width: 6),
                  Text(
                    statusLabel,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: badgeTextColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Admin Notes Box
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Admin Note: ${req.adminNotes}',
                style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
              ),
            ),
            const SizedBox(height: 14),

            // ── PAYMENT ACTION BUTTON ─────────────────────────────────
            if (isApproved) ...[
              // ✅ Admin Approved -> Pay Option is ENABLED!
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => AdoptionPaymentPage(
                          adoptionId: req.id,
                          petName: req.petName,
                          feeAmount: req.fee,
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.credit_card, color: Colors.white),
                  label: Text(
                    'Pay Adoption Fee (\$${req.fee.toStringAsFixed(0)}) via Stripe',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ] else if (isPending) ...[
              // ⏳ Pending -> Pay Option is DISABLED with tooltip
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: BorderSide(color: Colors.amber.shade700),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                            'Pay option will be enabled once Admin approves your request.'),
                        backgroundColor: Colors.orange,
                      ),
                    );
                  },
                  icon: Icon(Icons.lock_clock, color: Colors.amber.shade800),
                  label: Text(
                    'Awaiting Admin Approval (Pay Disabled)',
                    style: TextStyle(
                      color: Colors.amber.shade900,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            ] else if (isPaid) ...[
              // 🎉 Paid -> Completed state
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.green.shade300),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.check_circle, color: Colors.green, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Payment Verified • Pet Adopted 🎉',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPetImage(String path) {
    if (path.startsWith('assets/')) {
      return Image.asset(path,
          width: 70, height: 70, fit: BoxFit.cover,
          errorBuilder: (_, _, _) => Container(
                width: 70,
                height: 70,
                color: Colors.deepOrange.shade100,
                child: const Icon(Icons.pets, color: Colors.deepOrange),
              ));
    }
    return Image.file(File(path),
        width: 70, height: 70, fit: BoxFit.cover,
        errorBuilder: (_, _, _) => Container(
              width: 70,
              height: 70,
              color: Colors.deepOrange.shade100,
              child: const Icon(Icons.pets, color: Colors.deepOrange),
            ));
  }
}
