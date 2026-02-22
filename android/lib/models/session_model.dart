class SessionModel {
  final String id;
  final String agentName;
  final String status;
  final double ramUsage;

  SessionModel({required this.id, required this.agentName, required this.status, required this.ramUsage});

  factory SessionModel.fromJson(Map<String, dynamic> json) {
    return SessionModel(
      id: json['id'] ?? '',
      agentName: json['agent_name'] ?? '',
      status: json['status'] ?? 'Active',
      ramUsage: (json['ram_usage'] ?? 0).toDouble(),
    );
  }
}
