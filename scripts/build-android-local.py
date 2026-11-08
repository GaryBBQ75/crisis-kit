"""Build Android with the locally generated upload key; never print its password."""
from pathlib import Path
import os
import subprocess

root = Path(__file__).resolve().parent.parent
env = os.environ.copy()
local_jdk = root / '.build-tools/jdk-21.0.13+9/Contents/Home'
if local_jdk.exists():
    env['JAVA_HOME'] = str(local_jdk)
sdk = Path.home() / 'Library/Android/sdk'
if sdk.exists():
    env.setdefault('ANDROID_HOME', str(sdk))
key = root / '.release-secrets/crisis-kit-upload.jks'
password_file = key.with_name('password.txt')
if not key.exists() or not password_file.exists():
    raise SystemExit('Missing local upload key. See ANDROID_RELEASE.md.')
env.update(CRISIS_KEYSTORE=str(key), CRISIS_STORE_PASSWORD=password_file.read_text().strip(),
           CRISIS_KEY_ALIAS='crisis-kit-upload', CRISIS_KEY_PASSWORD=password_file.read_text().strip())
subprocess.run(['npm', 'run', 'android:sync'], cwd=root, env=env, check=True)
subprocess.run(['./gradlew', '--no-daemon', 'assembleDebug', 'assembleRelease', 'bundleRelease'],
               cwd=root / 'android', env=env, check=True)
