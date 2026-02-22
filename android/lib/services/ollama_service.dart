import 'package:http/http.dart' as http;
import 'dart:convert';

class OllamaService {
  final String baseUrl = 'http://localhost:11434';

  Future<List<String>> getModels() async {
    try {
      final response = await http.get(Uri.parse('\$baseUrl/api/tags'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return (data['models'] as List).map((m) => m['name'] as String).toList();
      }
    } catch (e) {
      print('OllamaService error: \$e');
    }
    return [];
  }
}
