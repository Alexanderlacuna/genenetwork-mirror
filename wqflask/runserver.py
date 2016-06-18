from wqflask import app

# Start the webserver with ./bin/genenetwork2
#
# Please note, running with host set externally below combined with debug mode
# is a big security no-no
# Unless you have a firewall setup
#
# Something like /sbin/iptables -A INPUT -p tcp -i eth0 -s ! 71.236.239.43 --dport 5000 -j DROP
# should do the trick
#
# You'll probably have to firewall the main port and the
#
# For more info see: http://www.cyberciti.biz/faq/iptables-block-port/

#import logging
#logging.basicConfig(filename="/tmp/flask_gn_log", level=logging.INFO)
#
#_log = logging.getLogger("search")
#_ch = logging.StreamHandler()
#_log.addHandler(_ch)

import logging
import utility.logger
logger = utility.logger.getLogger(__name__ )

BLUE  = '\033[94m'
GREEN = '\033[92m'
BOLD  = '\033[1m'
ENDC  = '\033[0m'

# We always output this information on startup
print "runserver.py: ****** The webserver has the following configuration ******"
keylist = app.config.keys()
keylist.sort()
for k in keylist:
    print("%s %s%s%s%s" % (k,BLUE,BOLD,app.config[k],ENDC))

logger.info("GN2 is running. Visit %shttp://localhost:5003/%s" % (BLUE,ENDC))

from utility.tools import WEBSERVER_MODE

werkzeug_logger = logging.getLogger('werkzeug')

if WEBSERVER_MODE == 'DEBUG':
    app.run(host='0.0.0.0',
            port=app.config['SERVER_PORT'],
            debug=True,
            use_debugger=True,
            threaded=False,
            use_reloader=True)
elif WEBSERVER_MODE == 'DEV':
    werkzeug_logger.setLevel(logging.WARNING)
    app.run(host='0.0.0.0',
            port=app.config['SERVER_PORT'],
            debug=False,
            use_debugger=False,
            threaded=False,
            processes=0,
            use_reloader=True)
else: #production mode
    app.run(host='0.0.0.0',
            port=app.config['SERVER_PORT'],
            debug=False,
            use_debugger=False,
            threaded=True,
            processes=8,
            use_reloader=True)
