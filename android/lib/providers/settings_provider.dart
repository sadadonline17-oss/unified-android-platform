import 'package:flutter/material.dart';

class SettingsProvider with ChangeNotifier {
  String _ollamaHost = 'http://localhost:11434';
  bool _cloudFreeMode = true;

  String get ollamaHost => _ollamaHost;
  bool get cloudFreeMode => _cloudFreeMode;

  void updateHost(String host) {
    _ollamaHost = host;
    notifyListeners();
  }

  void toggleCloudMode(bool val) {
    _cloudFreeMode = val;
    notifyListeners();
  }
}
