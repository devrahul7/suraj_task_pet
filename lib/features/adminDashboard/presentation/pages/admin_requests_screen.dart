import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';

class AdminRequestsScreen extends ConsumerStatefulWidget {
  const AdminRequestsScreen({super.key});

  @override
  ConsumerState<AdminRequestsScreen> createState() => _AdminRequestsScreenState();
}

class _AdminRequestsScreenState extends ConsumerState<AdminRequestsScreen> {
  String _filterStatus = 'ALL';

  @override
  Widget build(BuildContext context) {
    final requests = ref.watch(adoptionRequestProvider);
    final filtered = _filterStatus == 'ALL'
        ? requests
        : requests.where((r) => r.status == _filterStatus).toList();

    final pendingCount = requests.where((r) => r.status == 'PENDING').length;
    final approvedCount = requests.where((r) => r.status == 'APPROVED').length;
    final paidCount = requests.where((r) => r.status == 'PAID').length;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header ───────────────────────────────────────────────
            Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Adoption Requests",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'OutfitBold',
                        ),
                      ),
                      Text(
                        "Review & approve customer pet adoption requests",
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.deepOrange.shade50,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '$pendingCount Pending',
                    style: const TextStyle(
                      color: Colors.deepOrange,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // ── Status Filter Bar ────────────────────────────────────
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _filterChip('ALL', 'All (${requests.length})'),
                  const SizedBox(width: 8),
                  _filterChip('PENDING', 'Pending ($pendingCount)'),
                  const SizedBox(width: 8),
                  _filterChip('APPROVED', 'Approved ($approvedCount)'),
                  const SizedBox(width: 8),
                  _filterChip('PAID', 'Adopted ($paidCount)'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // ── Request Cards List ───────────────────────────────────
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.assignment_outlined,
                              size: 64, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(
                            _filterStatus == 'ALL'
                                ? 'No adoption requests found.'
                                : 'No $_filterStatus requests found.',
                            style: TextStyle(color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      itemCount: filtered.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final req = filtered[index];
                        final isPending = req.status == "PENDING";
                        final isApproved = req.status == "APPROVED";
                        final isPaid = req.status == "PAID";
                        final isRejected = req.status == "REJECTED";

                        Color badgeColor = Colors.amber.shade50;
                        Color badgeBorder = Colors.amber;
                        Color badgeText = Colors.amber.shade900;
                        String statusLabel = 'PENDING APPROVAL';

                        if (isApproved) {
                          badgeColor = Colors.blue.shade50;
                          badgeBorder = Colors.blue;
                          badgeText = Colors.blue.shade900;
                          statusLabel = 'APPROVED (PAYMENT PENDING)';
                        } else if (isPaid) {
                          badgeColor = Colors.green.shade50;
                          badgeBorder = Colors.green;
                          badgeText = Colors.green.shade900;
                          statusLabel = 'ADOPTED & PAID 🎉';
                        } else if (isRejected) {
                          badgeColor = Colors.red.shade50;
                          badgeBorder = Colors.red;
                          badgeText = Colors.red;
                          statusLabel = 'DECLINED';
                        }

                        return Card(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16)),
                          elevation: 2,
                          child: Padding(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(10),
                                      child: _buildPetImage(req.image),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            '${req.petName} (${req.breed})',
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            'Applicant: ${req.userName}',
                                            style: const TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w500),
                                          ),
                                          Text(
                                            req.userEmail,
                                            style: TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey.shade600),
                                          ),
                                          if (req.visitDate != null)
                                            Text(
                                              'Visit Date: ${req.visitDate}',
                                              style: TextStyle(
                                                  fontSize: 11,
                                                  color: Colors.deepOrange
                                                      .shade700),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),

                                // Status badge
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: badgeColor,
                                        borderRadius:
                                            BorderRadius.circular(20),
                                        border: Border.all(color: badgeBorder),
                                      ),
                                      child: Text(
                                        statusLabel,
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: badgeText,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      'Fee: \$${req.fee.toStringAsFixed(0)}',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                        color: Colors.deepOrange,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),

                                // Admin notes box
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade100,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    'Note: ${req.adminNotes}',
                                    style: const TextStyle(
                                        fontSize: 11,
                                        fontStyle: FontStyle.italic),
                                  ),
                                ),

                                // Action buttons for pending requests
                                if (isPending) ...[
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: Colors.red,
                                            side: const BorderSide(
                                                color: Colors.red),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                          ),
                                          onPressed: () {
                                            ref
                                                .read(adoptionRequestProvider
                                                    .notifier)
                                                .rejectRequest(req.id);
                                            ScaffoldMessenger.of(context)
                                                .showSnackBar(
                                              SnackBar(
                                                content: Text(
                                                    'Request for ${req.petName} declined.'),
                                                backgroundColor: Colors.red,
                                              ),
                                            );
                                          },
                                          icon: const Icon(Icons.close,
                                              size: 18),
                                          label: const Text('Decline'),
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.green,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                          ),
                                          onPressed: () {
                                            ref
                                                .read(adoptionRequestProvider
                                                    .notifier)
                                                .approveRequest(req.id);
                                            ScaffoldMessenger.of(context)
                                                .showSnackBar(
                                              SnackBar(
                                                content: Text(
                                                    '${req.petName} adoption request approved! Customer can now pay.'),
                                                backgroundColor: Colors.green,
                                              ),
                                            );
                                          },
                                          icon: const Icon(Icons.check,
                                              size: 18, color: Colors.white),
                                          label: const Text(
                                            'Approve Request',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ],
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

  Widget _filterChip(String key, String label) {
    final isSelected = _filterStatus == key;
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
        if (val) setState(() => _filterStatus = key);
      },
    );
  }

  Widget _buildPetImage(String imagePath) {
    if (imagePath.startsWith('assets/')) {
      return Image.asset(imagePath,
          width: 60, height: 60, fit: BoxFit.cover,
          errorBuilder: (_, _, _) => Container(
                width: 60,
                height: 60,
                color: Colors.deepOrange.shade100,
                child: const Icon(Icons.pets, color: Colors.deepOrange),
              ));
    }
    return Container(
      width: 60,
      height: 60,
      color: Colors.deepOrange.shade100,
      child: const Icon(Icons.pets, color: Colors.deepOrange),
    );
  }
}