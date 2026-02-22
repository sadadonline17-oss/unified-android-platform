import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        children: [
          ListTile(
            title: const Text('Ollama Host'),
            subtitle: const Text('http://localhost:11434'),
            trailing: const Icon(Icons.edit),
            onTap: () {},
          ),
          SwitchListTile(
            title: const Text('Cloud-Free Mode'),
            value: true,
            onChanged: (val) {},
          ),
          ListTile(
            title: const Text('Manage Models'),
            trailing: const Icon(Icons.arrow_forward),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}
