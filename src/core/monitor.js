function Monitor(instance, dom) {
  var self = this;
  sigma.classes.Cascade.call(this);

  this.instance = instance;
  this.monitoring = false;

  this.p = {
    fps: 40,
    dom: dom,
    globalProbes: {
      'Time (ms)': sigma.chronos.getExecutionTime,
      'Queue': sigma.chronos.getQueuedTasksCount,
      'Tasks': sigma.chronos.getTasksCount,
      'FPS': sigma.chronos.getFPS
    },
    localProbes: {
      'Nodes count': function() { return self.instance.graph.nodes.length; },
      'Edges count': function() { return self.instance.graph.edges.length; }
    }
  };

  function activate() {
    if (!self.monitoring) {
      self.monitoring = window.setInterval(routine, 1000 / self.p.fps);
    }

    return self;
  }

  function desactivate() {
    if (self.monitoring) {
      window.clearInterval(self.monitoring);
      self.monitoring = null;

      self.p.dom.innerHTML = '';
    }

    return self;
  }

  function routine() {
    var s = '';

    s += '<p>GLOBAL :</p>';
    for (var k in self.p.globalProbes) {
      s += '<p>' + k + ' : ' + self.p.globalProbes[k]() + '</p>';
    }

    s += '<br><p>LOCAL :</p>';
    for (var k in self.p.localProbes) {
      s += '<p>' + k + ' : ' + self.p.localProbes[k]() + '</p>';
    }

    self.p.dom.innerHTML = s;

    return self;
  }

  this.activate = activate;
  this.desactivate = desactivate;
}
