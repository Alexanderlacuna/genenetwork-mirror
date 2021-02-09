import subprocess


def run_subprocess(command):

    # subprocess.Popen([command], shell=True)
    popen = subprocess.Popen([command], shell=True, stdout=subprocess.PIPE)
    print("running")
    # print(popen.stdout)
    print(popen.stdout.readline())
    # for line in popen.stdout.readline:
    # 	print("hello")
    # 	print(line)
    # print(ds)

run_subprocess("python3  genelinks.py")
