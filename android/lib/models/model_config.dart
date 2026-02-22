class ModelConfig {
  final String name;
  final String provider; // 'local' or 'cloud'
  final bool isReady;

  ModelConfig({required this.name, required this.provider, required this.isReady});

  factory ModelConfig.fromJson(Map<String, dynamic> json) {
    return ModelConfig(
      name: json['name'] ?? '',
      provider: json['provider'] ?? 'local',
      isReady: json['is_ready'] ?? false,
    );
  }
}
