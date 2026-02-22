package com.platform.unified

import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity: FlutterActivity() {
    private val CHANNEL = "com.platform.unified/bridge"
    private lateinit var termuxBridge: TermuxBridge

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        termuxBridge = TermuxBridge(this)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "startService" -> {
                    val serviceName = call.argument<String>("service") ?: ""
                    termuxBridge.startService(serviceName)
                    result.success(true)
                }
                "stopService" -> {
                    val serviceName = call.argument<String>("service") ?: ""
                    termuxBridge.stopService(serviceName)
                    result.success(true)
                }
                "getRamUsage" -> {
                    val usage = ResourceMonitor.getRamUsage()
                    result.success(usage)
                }
                else -> {
                    result.notImplemented()
                }
            }
        }
    }
}
