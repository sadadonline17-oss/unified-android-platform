class AgentModel {
  final String id;
  final String name;
  final String status;
  final String requiredModel;

  AgentModel({required this.id, required this.name, required this.status, required this.requiredModel});

  factory AgentModel.fromJson(Map<String, dynamic> json) {
    return AgentModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      status: json['status'] ?? 'Stopped',
      requiredModel: json['required_model'] ?? 'llama3',
    );
  }
}
